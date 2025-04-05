"""
This script demonstrates the workflow for processing a video file with hand detection and sending the selected frames to the OpenAI GPT API for analysis.

The video file is processed frame by frame, extracting the frames and running hand detection on each frame. The frames with detected hand movements are then sent to the GPT API for analysis.
"""
import cv2
import sys
import os
import base64
import time
import asyncio
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

# Add the parent directory of the current script to sys.path
parent_directory = Path(__file__).resolve().parent.parent #__file__ is the path of the current file, parent is the parent directory, parent.parent is the grandparent directory
#lesson-management-service is the grandparent directory of the current file
sys.path.append(str(parent_directory))
from hand_detection_service import process_frames

# Load gpt key from .env file
load_dotenv()

#app init
app = FastAPI()

# CORS makes sure that the API can be accessed from any origin 
# should be restricted in future, only makes sense for development right now
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True, # allows cookies to be sent with the request (user session için)
    allow_methods=["*"], # we can use all methods
    allow_headers=["*"], # makes sure that authentication tokens are sent
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

# get the gpt key from the .env file (MAKE SURE TO USE " INSTEAD OF LEFT DOUBLE QUOTES IN .ENV FILE)
GPT_API_KEY = os.getenv("GPT_API_KEY")
client = OpenAI(api_key=GPT_API_KEY)

# Define input model
class VideoRequest(BaseModel):
    video_url: str  # Path or URL to the video file

# upload video to the server
@app.post("/upload-video")
async def upload_video(file: UploadFile = File(...)):
    try:
        print("Uploading video...")
        file_path = os.path.join(UPLOADS_DIR, file.filename) # get the directory from above
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return {"video_server_path": file_path}
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def extract_frames(video_path, interval=6):
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
        target_width = 256
        aspect_ratio = width / height
        target_height = int(target_width / aspect_ratio)
        
        # Resize image maintaining aspect ratio
        img = img.resize((target_width, target_height), Image.Resampling.LANCZOS) # LANCZOS is a high-quality resampling algorithm that is generally preferred for image resizing in cases like these
        
        # Save with optimal compression
        buffer = io.BytesIO() # this is used to save the image to an in memory byte buffer
        img.save(buffer, format='JPEG', quality=85, optimize=True)
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
        optimized_images = await asyncio.gather(*tasks) # wait for all the tasks to finish and collect the results
    
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
                max_tokens=5,  # smaller to force a concise response
                temperature=0.1  # lower temperature for more deterministic response
            )
        )
        
        api_time = time.time() - api_start_time
        print(f"  - GPT API call time: {api_time:.2f} seconds")

        # response handling
        response_text = response.choices[0].message.content.lower().strip()
        print(f"GPT response: {response_text}")
        
        if response_text.startswith("yes"):
            return "yes"
        else:
            return "no"

    except Exception as e:
        print(f"Error in GPT request: {str(e)}")
        return "no"

def process_with_detection(frames):
    """Process frames with hand detection with error handling"""
    print("Processing frames with hand detection...")
    try:
        if not frames:
            print("No valid frames to process")
            return []
            
        # ensure all frames exist and are valid
        validate_start = time.time()
        valid_frames = []
        for frame_path in frames:
            abs_path = os.path.abspath(frame_path)
            if os.path.exists(abs_path):
                valid_frames.append(abs_path)
                print(f"Valid frame path: {abs_path}") 
            else:
                print(f"Warning: Frame file not found: {abs_path}")
        
        if not valid_frames:
            print("No valid frames found for processing")
            return []
        
        validate_time = time.time() - validate_start
        print(f"  - Frame validation time: {validate_time:.2f} seconds")
        
        # skip early frames 
        if len(valid_frames) > 12:
            valid_frames = valid_frames[2:]  # skip the first 2 frames which often show setup
        
        # process frames with hand detection
        # increased threshold from 0.05 to 0.08 to be more selective about significant hand movements
        hand_detection_start = time.time()    
        selected_frames = process_frames(valid_frames, SELECTED_FRAMES_DIR, threshold=0.08)
        hand_detection_time = time.time() - hand_detection_start
        print(f"  - Core hand detection time: {hand_detection_time:.2f} seconds")
        
        if selected_frames:
            print(f"Successfully processed {len(selected_frames)} frames")
        return selected_frames
    except Exception as e:
        print(f"Error in process_with_detection: {e}")
        return []

def select_optimal_frames(frames, max_frames=15):
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
def preprocess_frames_for_detection(frames_dir, target_size=(320, 240)):
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
        
        print("=== PERFORMANCE METRICS ===")
        
        extract_start_time = time.time()
        frames = extract_frames(request.video_url)
        extract_time = time.time() - extract_start_time
        print(f"Frame extraction time: {extract_time:.2f} seconds")
        
        if not frames:
            return {"status": "error", "message": "No frames extracted"}

        print(f"Extracted {len(frames)} frames")
        print(f"Frame paths: {frames[:3]}...")  # Debug print first 3 frames
        
        # preprocess frames for faster detection
        preprocess_start_time = time.time()
        processed_frames = preprocess_frames_for_detection(EXTRACTED_FRAMES_DIR)
        preprocess_time = time.time() - preprocess_start_time
        print(f"Frame preprocessing time: {preprocess_time:.2f} seconds")
        
        # process with detection
        detection_start_time = time.time()
        selected_frames = await asyncio.to_thread(process_with_detection, processed_frames)
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
        
        # clean up files in background
        asyncio.create_task(cleanup_files())
        
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
        print(f"Cleanup error (non-critical): {e}")

if __name__ == "__main__":
    # capture the time spent on the process
    import uvicorn
    start_time = time.time()
    # Run the server on all network interfaces
    print(f"Time elapsed: {time.time() - start_time}")
    uvicorn.run(app, host="0.0.0.0", port=8000)