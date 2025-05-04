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
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from pydantic import BaseModel
import shutil
from dotenv import load_dotenv
from PIL import Image
import io
import re

# Constants
class VideoConstants:
    FRAME_INTERVAL = 6 
    TARGET_SIZE = (320, 240) 
    MAX_FRAMES = 15 
    HAND_DETECTION_THRESHOLD = 0.08 
    GPT_MAX_TOKENS = 250
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
    print("\n=== FRAME EXTRACTION START ===")
    start_time = time.time()
    print(f"Extracting frames from video: {video_path}")
    print(f"Using frame interval: {interval}")

    if(video_path.startswith("file://")):
        video_path = video_path[7:]

    # clear existing frames otherwise it takes the previous frames and gives incorrect results
    print("\nCleaning up existing frames...")
    cleanup_start = time.time()
    for file in os.listdir(EXTRACTED_FRAMES_DIR):
        os.remove(os.path.join(EXTRACTED_FRAMES_DIR, file))
        print(f"Removed: {file}")
        
    # clear selected frames directory to ensure we don't use old frames
    for file in os.listdir(SELECTED_FRAMES_DIR):
        os.remove(os.path.join(SELECTED_FRAMES_DIR, file))
        print(f"Removed: {file}")
    cleanup_time = time.time() - cleanup_start
    print(f"Cleanup completed in {cleanup_time:.2f} seconds")

    cap = cv2.VideoCapture(video_path)
    frame_id = 0
    frame_count = 0
    extracted_count = 0

    print("\nStarting frame extraction...")
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % interval == 0:
            output_path = os.path.join(EXTRACTED_FRAMES_DIR, f"frame_{frame_id}.jpg")
            cv2.imwrite(output_path, frame)
            frame_id += 1
            extracted_count += 1
        
        frame_count += 1

    cap.release()
    
    # full paths to frames instead of just filenames
    frame_files = sorted(os.listdir(EXTRACTED_FRAMES_DIR))
    frame_paths = [os.path.join(EXTRACTED_FRAMES_DIR, filename) for filename in frame_files]
    total_time = time.time() - start_time
    print(f"\nExtraction Summary:")
    print(f"- Total frames in video: {frame_count}")
    print(f"- Extracted frames: {extracted_count}")
    print(f"- Frame paths generated: {len(frame_paths)}")
    print(f"- Total extraction time: {total_time:.2f} seconds")
    print("=== FRAME EXTRACTION COMPLETE ===\n")
    return frame_paths

async def process_frame_batch(frame_batch):
    """Process a batch of frames in parallel to shorten the response time"""
    print("\n=== FRAME BATCH PROCESSING START ===")
    start_time = time.time()
    try:
        # Create a temporary directory for processed frames
        temp_dir = os.path.join(os.path.dirname(EXTRACTED_FRAMES_DIR), "temp_processed")
        os.makedirs(temp_dir, exist_ok=True)
        print(f"Created temp directory: {temp_dir}")
        
        # ThreadPoolExecutor is used to process the frames in parallel
        with ThreadPoolExecutor() as executor:
            loop = asyncio.get_event_loop()
            tasks = []
            print(f"\nProcessing {len(frame_batch)} frames...")
            for i, frame_path in enumerate(frame_batch):
                if os.path.exists(frame_path):  # Check if file exists
                    # Save frame as temporary file
                    temp_path = os.path.join(temp_dir, f"processed_frame_{i}.jpg")
                    tasks.append(loop.run_in_executor(executor, lambda p: cv2.imwrite(p, cv2.imread(frame_path)), temp_path))
                else:
                    print(f"Warning: Frame file not found: {frame_path}")
            
            if not tasks:
                print("No valid frames to process")
                return []
            
            # Wait for all frames to be saved
            print("Waiting for frame processing to complete...")
            await asyncio.gather(*tasks)
            
            # Get all saved frame paths
            processed_frames = sorted([os.path.join(temp_dir, f) for f in os.listdir(temp_dir) if f.endswith('.jpg')])
            total_time = time.time() - start_time
            print(f"\nBatch Processing Summary:")
            print(f"- Processed frames: {len(processed_frames)}")
            print(f"- Total processing time: {total_time:.2f} seconds")
            print("=== FRAME BATCH PROCESSING COMPLETE ===\n")
            return processed_frames
            
    except Exception as e:
        print(f"Error in process_frame_batch: {e}")
        return []
    
# resize the image to 256x256 and convert it to RGB for faster processing and less memory usage
def optimize_image_for_api(frame):
    """Optimize image size and quality for API transmission while maintaining aspect ratio"""
    try:
        # Convert numpy array to PIL Image
        if isinstance(frame, np.ndarray):
            # Convert BGR to RGB if needed
            if len(frame.shape) == 3 and frame.shape[2] == 3:
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            img = Image.fromarray(frame)
        else:
            # If it's a file path, open it
            img = Image.open(frame)
        
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
    except Exception as e:
        print(f"Error optimizing image: {str(e)}")
        return None

# send the frames to the GPT API
import json

async def send_frames_to_gpt(frames, target_word):
    print(f"Sending {len(frames)} frames to GPT...")
    
    opt_start_time = time.time()
    
    with ThreadPoolExecutor() as executor:
        loop = asyncio.get_event_loop()
        tasks = [
            loop.run_in_executor(executor, optimize_image_for_api, frame)
            for frame in frames
        ]
        optimized_images = await asyncio.gather(*tasks)
    
    opt_time = time.time() - opt_start_time
    print(f"  - Image optimization time: {opt_time:.2f} seconds")
    
    message_content = [
        {
            "type": "text",
            "text": f"""Analyze these images as a sequence showing a hand gesture and determine if they show the "{target_word.upper()}" hand gesture/sign language.

            A "{target_word.lower()}" gesture typically includes:
            - The appropriate hand shape and movement for "{target_word.lower()}"
            - The hand positioned in the correct location
            - The correct palm orientation
            - The correct finger configuration

            IMPORTANT: This is specifically for the "{target_word.upper()}" gesture. However, consider that the images may include slight angle variations or camera imperfections. If the gesture is **reasonably** clear and matches the intent of the "{target_word.upper()}" sign, answer "YES."

            Return the result in this JSON format:
            {{
                "explanation": "A short explanation of what you see in the images",
                "answer": "YES" or "NO",
                "feedback": "STRICTLY one sentence describing how the user gestured or what should be corrected (ONLY if answer is NO)"
            }}

            Be careful, but not overly strict: if the gesture is clearly intended as the target, accept it even if the angle or framing is not perfect.
            """
                },
    ]


    print("\n=== GPT PROMPT ===")
    print(message_content[0]["text"])
    print("=================\n")

    for image_b64 in optimized_images:
        message_content.append({
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{image_b64}"
            },
        })

    try:
        print(f"Sending request to GPT with {len(optimized_images)} frames...")
        
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
        raw_response = response.choices[0].message.content.strip()
        print("\n=== GPT RESPONSE ===")
        print(f"Raw response: {raw_response}")
        print("===================\n")

        try:
            # Remove surrounding triple backticks if present
            cleaned_response = re.sub(r'^```json\s*|```$', '', raw_response.strip(), flags=re.IGNORECASE).strip()
            result_data = json.loads(cleaned_response)
            answer = result_data.get("answer", "").lower()
            feedback = result_data.get("feedback", "").strip()
            
            return {
                "answer": answer,
                "feedback": feedback if answer == "no" else ""
            }
        except json.JSONDecodeError:
            print("Failed to parse JSON from GPT response.")
            return {
                "answer": "no",
                "feedback": "Could not parse feedback from GPT."
            }

    except Exception as e:
        print(f"Error in GPT request: {str(e)}")
        return {
            "answer": "no",
            "feedback": "An error occurred during GPT request."
        }


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
    print("\n=== FRAME SELECTION START ===")
    start_time = time.time()
    print(f"Selecting optimal frames from {len(frames)} total frames")
    
    if not frames:
        print("No frames to select from")
        return []
    
    if len(frames) <= max_frames:
        print(f"Using all {len(frames)} frames (less than max_frames={max_frames})")
        return frames
    
    frame_count = len(frames)
    print(f"Total frames with hand gestures: {frame_count}")
    
    if frame_count <= 2:
        print("Using all frames (2 or fewer)")
        return frames
        
    def extract_frame_number(filepath):
        filename = os.path.basename(filepath)
        try:
            if "selected_frame_frame_" in filename:
                return int(filename.split("selected_frame_frame_")[1].split(".")[0])
            elif "frame_" in filename:
                return int(filename.split("frame_")[1].split(".")[0])
            return 0
        except:
            return 0
    
    frames_with_numbers = [(f, extract_frame_number(f)) for f in frames]
    frames_with_numbers.sort(key=lambda x: x[1])
    sorted_frames = [f[0] for f in frames_with_numbers]
    
    # Always include first and last frames to capture the full gesture
    selected = [sorted_frames[0], sorted_frames[-1]]
    print("Selected first and last frames")
    
    # If we have more than 2 frames, add the middle frame
    if frame_count > 2:
        selected.append(sorted_frames[frame_count//2])
        print("Added middle frame")
    
    # Calculate intervals for remaining frames, but only if we have enough frames
    remaining_slots = max_frames - len(selected)
    if remaining_slots > 0 and frame_count > 3:
        print(f"Adding {remaining_slots} additional frames")
        segment_size = frame_count // (remaining_slots + 1)
        for i in range(1, remaining_slots + 1):
            index = i * segment_size
            if index < frame_count and sorted_frames[index] not in selected:
                selected.append(sorted_frames[index])
    
    # Sort the selected frames by their original order
    selected.sort(key=lambda x: sorted_frames.index(x))
    
    total_time = time.time() - start_time
    print(f"\nFrame Selection Summary:")
    print(f"- Total frames with gestures: {len(frames)}")
    print(f"- Selected frames: {len(selected)}")
    print(f"- Selection time: {total_time:.2f} seconds")
    print("=== FRAME SELECTION COMPLETE ===\n")
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
async def process_video(request: Request):
    print("\n=== VIDEO PROCESSING START ===")
    process_start_time = time.time()
    try:
        data = await request.json()
        video_url = data.get("video_url")
        target_word = data.get("target_word", "hello")
        
        print(f"Processing video for target word: {target_word}")
        print(f"Video URL: {video_url}")
        
        if not video_url:
            raise HTTPException(status_code=400, detail="No video URL provided")
            
        # Extract frames from video
        frame_extraction_start = time.time()
        frame_paths = extract_frames(video_url)
        frame_extraction_time = time.time() - frame_extraction_start
        print(f"Frame extraction completed in {frame_extraction_time:.2f} seconds")
        
        # Process frames 
        frame_processing_start = time.time()
        frames = await process_frame_batch(frame_paths)
        frame_processing_time = time.time() - frame_processing_start
        print(f"Frame processing completed in {frame_processing_time:.2f} seconds")
        
        # Select optimal frames
        frame_selection_start = time.time()
        optimal_frames = select_optimal_frames(frames)
        frame_selection_time = time.time() - frame_selection_start
        print(f"Frame selection completed in {frame_selection_time:.2f} seconds")
        
        # get GPT result with optimized frames
        gpt_start_time = time.time()
        gpt_result = await send_frames_to_gpt(optimal_frames, target_word)
        gpt_time = time.time() - gpt_start_time
        print(f"GPT API processing completed in {gpt_time:.2f} seconds")
        
        # Clean up all temporary files after processing
        cleanup_start = time.time()
        await cleanup_files()
        cleanup_time = time.time() - cleanup_start
        print(f"Cleanup completed in {cleanup_time:.2f} seconds")
        
        total_time = time.time() - process_start_time
        print(f"\nTotal Processing Summary:")
        print(f"- Frame Extraction: {frame_extraction_time:.2f} seconds")
        print(f"- Frame Processing: {frame_processing_time:.2f} seconds")
        print(f"- Frame Selection: {frame_selection_time:.2f} seconds")
        print(f"- GPT Processing: {gpt_time:.2f} seconds")
        print(f"- Cleanup: {cleanup_time:.2f} seconds")
        print(f"- Total Time: {total_time:.2f} seconds")
        print("=== VIDEO PROCESSING COMPLETE ===\n")
        
        return {"status": "success", "analysis": gpt_result}
        
    except Exception as e:
        print(f"An error occurred in process_video: {e}")
        # Clean up files even if there's an error
        await cleanup_files()
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
            try:
                upload_frame_to_s3(frame, s3_key)
                s3_frame_keys.append(s3_key)
                frame_id += 1
            except Exception as e:
                print(f"Error uploading frame {frame_id}: {str(e)}")
                continue

        frame_count += 1

    cap.release()
    return s3_frame_keys

def upload_frame_to_s3(frame, s3_key):
    success, buffer = cv2.imencode('.jpg', frame)
    if success:
        s3.upload_fileobj(io.BytesIO(buffer), os.getenv("S3_BUCKET_NAME"), s3_key)


async def cleanup_files():
    """Asynchronous cleanup of temporary files and uploaded video"""
    try:
        # Clean up temporary directories
        temp_dir = os.path.join(os.path.dirname(EXTRACTED_FRAMES_DIR), "temp_frames")
        for directory in [EXTRACTED_FRAMES_DIR, SELECTED_FRAMES_DIR, temp_dir]:
            if os.path.exists(directory):
                for file in os.listdir(directory):
                    try:
                        os.remove(os.path.join(directory, file))
                    except Exception as e:
                        print(f"Error removing file in {directory}: {e}")
        
        # Clean up uploaded videos
        if os.path.exists(UPLOADS_DIR):
            for file in os.listdir(UPLOADS_DIR):
                try:
                    video_path = os.path.join(UPLOADS_DIR, file)
                    os.remove(video_path)
                    print(f"Cleaned up uploaded video: {file}")
                except Exception as e:
                    print(f"Error removing uploaded video {file}: {e}")
                    
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