"""
This script demonstrates the workflow for processing a video file with hand detection and sending the selected frames to the OpenAI GPT API for analysis.

The video file is processed frame by frame, extracting the frames and running hand detection on each frame. The frames with detected hand movements are then sent to the GPT API for analysis.
"""
import uuid
import cv2
import sys
import os
import base64
import time
import asyncio
import boto3
import numpy as np
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from openai import OpenAI
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import shutil
from dotenv import load_dotenv
from PIL import Image
import io

# Constants
class VideoConstants:
    FRAME_INTERVAL = 6 
    TARGET_SIZE = (320, 240) 
    MAX_FRAMES = 15 
    HAND_DETECTION_THRESHOLD = 0.08 
    GPT_MAX_TOKENS = 5 
    GPT_TEMPERATURE = 0.1 
    IMAGE_QUALITY = 85
    TARGET_WIDTH = 256

# Add the parent directory of the current script to sys.path
parent_directory = Path(__file__).resolve().parent.parent #__file__ is the path of the current file, parent is the parent directory, parent.parent is the grandparent directory
#lesson-management-service is the grandparent directory of the current file
sys.path.append(str(parent_directory))
from hand_detection_service import process_frames

# Load gpt key from .env file
load_dotenv()

s3 = boto3.client(
    's3',
    region_name=os.getenv("AWS_REGION"),  # e.g., "eu-central-1"
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),       # optional if IAM role is used
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")  # optional if IAM role is used
)

bucket_name = os.getenv("S3_BUCKET_NAME")  # e.g., "signifyappbucket"

# Initialize OpenAI client
GPT_API_KEY = os.getenv("GPT_API_KEY")
if not GPT_API_KEY:
    raise ValueError("GPT_API_KEY not found in environment variables")

# Initialize OpenAI client without any proxy settings
client = OpenAI(api_key=GPT_API_KEY)

#app init
app = FastAPI()

# CORS makes sure that the API can be accessed from any origin 
# should be restricted in future, only makes sense for development right now
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Directories - Using absolute paths otherwise app crashes and cannot find the paths
WORKSPACE_DIR = Path(__file__).resolve().parent
EXTRACTED_FRAMES_DIR = str(WORKSPACE_DIR / "extracted_frames")
SELECTED_FRAMES_DIR = str(WORKSPACE_DIR / "selected_frames")
UPLOADS_DIR = str(WORKSPACE_DIR / "uploads")

# Create directories with absolute paths
os.makedirs(EXTRACTED_FRAMES_DIR, exist_ok=True)
os.makedirs(SELECTED_FRAMES_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)

# Define input model
class VideoRequest(BaseModel):
    video_url: str  # Path or URL to the video file

# upload video to the server
@app.post("/upload-video")
async def upload_video(file: UploadFile = File(...)):
    try:
        print(f"Uploading video: {file.filename}")
        print(f"Uploads directory: {UPLOADS_DIR}")
        
        # Ensure uploads directory exists
        os.makedirs(UPLOADS_DIR, exist_ok=True)
        
        # Check if directory is writable
        if not os.access(UPLOADS_DIR, os.W_OK):
            raise HTTPException(status_code=500, detail="Uploads directory is not writable")
            
        file_path = os.path.join(UPLOADS_DIR, file.filename)
        print(f"Saving to: {file_path}")
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        print(f"Successfully uploaded video to: {file_path}")
        return {"video_server_path": file_path}
    except Exception as e:
        print(f"An error occurred during upload: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to upload video: {str(e)}")

def extract_frames(video_path, interval=VideoConstants.FRAME_INTERVAL):
    print("Extracting frames from video...", video_path)

    if(video_path.startswith("file://")):
        video_path = video_path[7:]

    # clear existing frames otherwise it takes the previous frames and gives incorrect results
    for file in os.listdir(EXTRACTED_FRAMES_DIR):
        os.remove(os.path.join(EXTRACTED_FRAMES_DIR, file))

    cap = cv2.VideoCapture(video_path)
    frame_id = 0
    frame_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Only process every 'interval' frame
        if frame_count % interval == 0:
            output_path = os.path.join(EXTRACTED_FRAMES_DIR, f"frame_{frame_id}.jpg")
            cv2.imwrite(output_path, frame)
            frame_id += 1
        
        frame_count += 1

    cap.release()
    
    # full paths to frames instead of just filenames
    frame_files = sorted(os.listdir(EXTRACTED_FRAMES_DIR))
    frame_paths = [os.path.join(EXTRACTED_FRAMES_DIR, filename) for filename in frame_files]
    print(f"Extracted {len(frame_paths)} frames from {frame_count} total frames (interval: {interval})")
    return frame_paths

async def process_frame_batch(frame_batch):
    """Process a batch of frames in parallel to shorten the response time"""
    try:
        # ThreadPoolExecutor is used to proccess the frames in parallel to shorten the response time
        with ThreadPoolExecutor() as executor:
            loop = asyncio.get_event_loop() # get_event_loop is used to get the event loop to manage this task
            # event loop is responsible for running the tasks in parallel
            # if an asyncio task is created, it is added to the event loop
            # if an event loop is not running, it is created and run
            # if an event loop is running, the task is added to the event loop

            tasks = []
            for frame_path in frame_batch:
                if os.path.exists(frame_path):  # Check if file exists
                    tasks.append(loop.run_in_executor(executor, cv2.imread, frame_path)) # this line makes sure that the frame is read in parallel 
                    # this way when processing 100 frames, it will not take 100 times the time
                    # but instead it will take the time of the longest frame
                    # this is because the frames are read in parallel
                    # and the time it takes to read the frames is the same
                    # so it is faster to read all the frames at once
                    # and then process them in parallel

                else:
                    print(f"Warning: Frame file not found: {frame_path}")
            
            if not tasks:
                return []
            
            frames = await asyncio.gather(*tasks, return_exceptions=True) # this line is used to run the tasks in parallel
            # gather is used to run the tasks in parallel
            # return_exceptions is used to return the exceptions and makes sure that the program does not crash
            # if an exception is thrown, it is returned in the list so it can be handled later

            # Filter out None values and exceptions
            valid_frames = [f for f in frames if f is not None and not isinstance(f, Exception)]
            return valid_frames
    except Exception as e:
        print(f"Error in process_frame_batch: {e}")
        return []
    
# resize the image to 256x256 and convert it to RGB for faster processing and less memory usage
def optimize_image_for_api(image_path):
    """Optimize image size and quality for API transmission while maintaining aspect ratio"""
    with Image.open(image_path) as img:
        # Convert to RGB
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Calculate new dimensions maintaining aspect ratio
        width, height = img.size
        target_width = VideoConstants.TARGET_WIDTH
        aspect_ratio = width / height
        target_height = int(target_width / aspect_ratio)
        
        # Resize image maintaining aspect ratio
        img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
        
        # Save with optimal compression
        buffer = io.BytesIO()
        img.save(buffer, format='JPEG', quality=VideoConstants.IMAGE_QUALITY, optimize=True)
        return base64.b64encode(buffer.getvalue()).decode('utf-8')

# send the frames to the GPT API
async def send_frames_to_gpt(frames):
    print(f"Sending {len(frames)} frames to GPT...")
    
    # track optimization time
    opt_start_time = time.time()
    
    # use the ThreadPoolExecutor function again to optimize the images in parallel
    with ThreadPoolExecutor() as executor:
        loop = asyncio.get_event_loop()
        tasks = [
            loop.run_in_executor(executor, optimize_image_for_api, frame)
            for frame in frames  # process all frames
        ]
        optimized_images = await asyncio.gather(*tasks)
    
    opt_time = time.time() - opt_start_time
    print(f"  - Image optimization time: {opt_time:.2f} seconds")

    message_content = [
        {
            "type": "text",
            "text": """Analyze these images as a sequence showing a hand gesture and determine if they show a HELLO or GREETING hand gesture/sign language.

A hello/greeting gesture typically includes:
- Waving motion with open palm
- The hand positioned near the face or raised to shoulder level
- Open palm facing forward
- Fingers together or slightly spread
first tell me what the person is gesturing including their posture and hand movements
then
Give me a SINGLE one-word answer:
- Answer "YES" if these frames clearly show a hello/greeting gesture
- Answer "NO" for any other gesture (pointing, thumbs up, peace sign, etc.)

Be strict in your assessment. If uncertain, answer "NO".
"""
        },
    ]

    # Add all optimized frames to message content
    for image_b64 in optimized_images:
        message_content.append({
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{image_b64}"
            },
        })

    try:
        print(f"Sending request to GPT with {len(optimized_images)} frames...")
        
        # Track actual API call time
        api_start_time = time.time()
        
        response = await asyncio.to_thread(
            lambda: client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": message_content}],
                max_tokens=VideoConstants.GPT_MAX_TOKENS,
                temperature=VideoConstants.GPT_TEMPERATURE
            )
        )
        
        api_time = time.time() - api_start_time
        print(f"  - GPT API call time: {api_time:.2f} seconds")

        # response handling
        response_text = response.choices[0].message.content.lower().strip()
        print(f"GPT response: {response_text}")
        
        print(response_text)
        if response_text.startswith("yes"):
            return "yes"
        else:
            return "no"

    except Exception as e:
        print(f"Error in GPT request: {str(e)}")
        return "no"

def process_with_detection_s3(frame_keys, s3_folder_prefix):
    """Process frames stored in S3 with hand detection"""
    try:
        if not frame_keys:
            print("No frame keys provided")
            return []

        print(f"Processing {len(frame_keys)} frames from S3 folder: {s3_folder_prefix}")

        # Sort by frame number for consistent order
        def extract_frame_number(s3_key):
            try:
                return int(s3_key.split("frame_")[1].split(".")[0])
            except:
                return 0

        frame_keys = sorted(frame_keys, key=extract_frame_number)

        # Skip early frames
        if len(frame_keys) > 12:
            frame_keys = frame_keys[2:]

        # Load frames from S3 into memory (as numpy arrays)
        frames = []
        for key in frame_keys:
            frame = load_frame_from_s3(key)
            if frame is not None:
                frames.append((key, frame))
            else:
                print(f"Failed to load frame: {key}")

        if not frames:
            print("No valid frames loaded from S3")
            return []

        # Save processed frames to a temp directory before detection (optional but useful for reuse)
        local_temp_dir = os.path.join("/tmp", s3_folder_prefix.replace("/", "_"))
        os.makedirs(local_temp_dir, exist_ok=True)
        local_paths = []

        for i, (s3_key, frame) in enumerate(frames):
            local_path = os.path.join(local_temp_dir, f"frame_{i}.jpg")
            cv2.imwrite(local_path, frame)
            local_paths.append(local_path)

        # Process valid local paths
        selected_frames = process_frames(local_paths, SELECTED_FRAMES_DIR, threshold=VideoConstants.HAND_DETECTION_THRESHOLD)

        return selected_frames

    except Exception as e:
        print(f"Error in process_with_detection_s3: {e}")
        return []
    
def load_frame_from_s3(s3_key):
    print("HELLOOOOOOO SÜPER ÇALIŞIYO KODUMUZ")
    try:
        obj = s3.get_object(Bucket=bucket_name, Key=s3_key)
        image_bytes = obj['Body'].read()
        image_array = np.asarray(bytearray(image_bytes), dtype=np.uint8)
        return cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    except Exception as e:
        print(f"Failed to load frame {s3_key}: {e}")
        return None

def select_optimal_frames(frames, max_frames=VideoConstants.MAX_FRAMES):
    """
    Select the optimal frames to send to GPT API to balance accuracy and cost.
    
    Parameters:
    frames (list): List of frame file paths with detected hands
    max_frames (int): Maximum number of frames to select, defaults to 15
    
    Returns:
    list: Selected frame file paths
    """
    if not frames:
        return []
    
    if len(frames) <= max_frames:
        # if we have fewer frames than the maximum, use all of them
        return frames
    
    # for longer videos, select frames distributed throughout the gesture
    # this way we can capture the beginning, middle, and end of the gesture
    frame_count = len(frames)
    
    if frame_count <= 2:
        return frames
        
    def extract_frame_number(filepath):
        filename = os.path.basename(filepath)
        try:
            # something like "selected_frame_frame_42.jpg"
            if "selected_frame_frame_" in filename:
                return int(filename.split("selected_frame_frame_")[1].split(".")[0])
            # extract the number
            elif "frame_" in filename:
                return int(filename.split("frame_")[1].split(".")[0])
            return 0
        except:
            return 0
    
    frames_with_numbers = [(f, extract_frame_number(f)) for f in frames]
    frames_with_numbers.sort(key=lambda x: x[1])
    sorted_frames = [f[0] for f in frames_with_numbers]
    
    # include first, middle, and last frames
    selected = [sorted_frames[0], sorted_frames[frame_count//2], sorted_frames[-1]]
    
    # calculate intervals for remaining frames
    remaining_slots = max_frames - 3
    if remaining_slots > 0:
        # divide the sequence into equal segments
        segment_size = frame_count // (remaining_slots + 1)
        for i in range(1, remaining_slots + 1):
            index = i * segment_size
            if index < frame_count and sorted_frames[index] not in selected:
                selected.append(sorted_frames[index])
    
    # add more frames from uncovered regions
    while len(selected) < max_frames and len(selected) < frame_count:
        # largest gap between selected frames
        selected_indices = [sorted_frames.index(f) for f in selected]
        selected_indices.sort()
        
        max_gap = 0
        gap_index = 0
        
        for i in range(len(selected_indices) - 1):
            gap = selected_indices[i + 1] - selected_indices[i]
            if gap > max_gap:
                max_gap = gap
                gap_index = i
        
        if max_gap <= 1:
            break
            
        # add frame from middle of largest gap
        new_index = selected_indices[gap_index] + max_gap // 2
        if new_index < frame_count and sorted_frames[new_index] not in selected:
            selected.append(sorted_frames[new_index])
    
    selected.sort(key=lambda x: sorted_frames.index(x))
    
    print(f"Optimized frame selection: {len(frames)} frames with hand gestures → {len(selected)} frames to send to GPT")
    return selected

# resize the image for faster processing in hand detection
def preprocess_frames_for_detection(frames_dir, target_size=VideoConstants.TARGET_SIZE):
    """
    Resize all frames in a directory to a smaller size for faster processing.
    
    Args:
        frames_dir: Directory containing frames
        target_size: Target size for resizing (width, height)
        
    Returns:
        List of resized frame paths
    """
    print(f"Preprocessing frames for faster detection...")
    start_time = time.time()
    
    # create a temp dir for resized frames
    temp_dir = os.path.join(os.path.dirname(frames_dir), "temp_frames")
    os.makedirs(temp_dir, exist_ok=True)
    
    # clear any existing files
    for file in os.listdir(temp_dir):
        os.remove(os.path.join(temp_dir, file))
    
    resized_frames = []
    
    # process frames in parallel using ThreadPoolExecutor again
    def resize_frame(frame_path):
        frame = cv2.imread(frame_path)
        if frame is None:
            return None
            
        resized = cv2.resize(frame, target_size)
        filename = os.path.basename(frame_path)
        output_path = os.path.join(temp_dir, filename)
        cv2.imwrite(output_path, resized)
        return output_path
    
    with ThreadPoolExecutor() as executor:
        frame_paths = [os.path.join(frames_dir, f) for f in os.listdir(frames_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
        results = list(executor.map(resize_frame, frame_paths))
        resized_frames = [r for r in results if r is not None]
    
    print(f"Preprocessed {len(resized_frames)} frames in {time.time() - start_time:.2f} seconds")
    return resized_frames

# Main Workflow
@app.post("/process-video")
async def process_user_video(request: VideoRequest):
    try:
        total_start_time = time.time()
        
        
        extract_start_time = time.time()
        session_id = str(uuid.uuid4())  # or get from user session
        exercise_id = "demo"  # pass dynamically in real use
        folder_name = f"USER_DATA/{session_id}_{exercise_id}/"
        s3_frame_keys = extract_frames_to_s3(request.video_url, folder_name)
        extract_time = time.time() - extract_start_time
        print(f"Frame extraction time: {extract_time:.2f} seconds")
        
        if not s3_frame_keys:
            return {"status": "error", "message": "No frames extracted"}

        print(f"Extracted {len(s3_frame_keys)} frames")
        print(f"Frame paths: {s3_frame_keys[:3]}...")  # Debug print first 3 frames
        
        # preprocess frames for faster detection
        preprocess_start_time = time.time()
        preprocess_time = time.time() - preprocess_start_time
        print(f"Frame preprocessing time: {preprocess_time:.2f} seconds")
        
        # process with detection
        detection_start_time = time.time()
        
        selected_frames = await asyncio.to_thread(
            process_with_detection_s3, 
            s3_frame_keys, 
            folder_name
        )
        detection_time = time.time() - detection_start_time
        print(f"Hand detection time: {detection_time:.2f} seconds")
        
        if not selected_frames:
            return {"status": "error", "message": "No hands detected in the processed frames"}

        print(f"Selected {len(selected_frames)} frames with hand gestures")
        print(f"Selected frame paths: {selected_frames[:3]}...")  # Debug print first 3 selected frames

        # select optimal subset of frames to send to GPT
        optimal_frames = select_optimal_frames(selected_frames)
        
        # get GPT result with optimized frames
        gpt_start_time = time.time()
        gpt_result = await send_frames_to_gpt(optimal_frames)
        gpt_time = time.time() - gpt_start_time
        print(f"GPT API processing time: {gpt_time:.2f} seconds")
        
        print(f"Final result: {gpt_result}")
        
        # calculate and log the total time
        total_time = time.time() - total_start_time
        print(f"Total processing time: {total_time:.2f} seconds")
        print("========================")
        
        
        return {
            "status": "success",
            "analysis": gpt_result,
            "processing_time": {
                "total_time": round(total_time, 2),
                "frame_extraction": round(extract_time, 2),
                "preprocessing": round(preprocess_time, 2),
                "hand_detection": round(detection_time, 2),
                "gpt_processing": round(gpt_time, 2)
            }
        }
        
    except Exception as e:
        print(f"An error occurred in process_user_video: {e}")
        return {
            "status": "error",
            "message": "An internal error has occurred. Please try again later."
        }

def extract_frames_to_s3(video_path, s3_folder, interval=VideoConstants.FRAME_INTERVAL):
    cap = cv2.VideoCapture(video_path)
    frame_id = 0
    frame_count = 0
    s3_frame_keys = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % interval == 0:
            s3_key = f"{s3_folder}frame_{frame_id}.jpg"
            upload_frame_to_s3(frame, s3_key)
            s3_frame_keys.append(s3_key)
            frame_id += 1

        frame_count += 1

    cap.release()
    return s3_frame_keys

def upload_frame_to_s3(frame, s3_key):
    try:
        success, buffer = cv2.imencode('.jpg', frame)
        if success:
            s3.put_object(
                Bucket=os.getenv("S3_BUCKET_NAME"),
                Key=s3_key,
                Body=io.BytesIO(buffer),
                ContentType='image/jpeg'
            )
    except Exception as e:
        print(f"S3 Upload Error: {str(e)}")
        raise

if __name__ == "__main__":
    # capture the time spent on the process
    import uvicorn
    start_time = time.time()
    # Run the server on all network interfaces
    print(f"Time elapsed: {time.time() - start_time}")
    uvicorn.run(app, host="0.0.0.0", port=8000)