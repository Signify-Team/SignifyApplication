"""
This script demonstrates the workflow for processing a video file with hand detection and sending the selected frames to the OpenAI GPT API for analysis.

The video file is processed frame by frame, extracting the frames and running hand detection on each frame. The frames with detected hand movements are then sent to the GPT API for analysis.
"""
import cv2
import sys
import os
import base64
import time
from pathlib import Path
from openai import OpenAI
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi import FastAPI, File, UploadFile
import shutil

# Initialize the app
app = FastAPI()

# Add the parent directory of the current script to sys.path
parent_directory = Path(__file__).resolve().parent.parent  # lesson-management-service
sys.path.append(str(parent_directory))

# Import process_frames
from hand_detection_service import process_frames

# Directories
EXTRACTED_FRAMES_DIR = "extracted_frames"
SELECTED_FRAMES_DIR = "selected_frames"
os.makedirs(EXTRACTED_FRAMES_DIR, exist_ok=True)
os.makedirs(SELECTED_FRAMES_DIR, exist_ok=True)

GPT_API_KEY = os.getenv("GPT_API_KEY")

client = OpenAI(api_key=GPT_API_KEY)

# Define input model
class VideoRequest(BaseModel):
    video_url: str  # Path or URL to the video file

@app.post("/upload-video")
async def upload_video(file: UploadFile = File(...)):
    try:
        print("Uploading video...")
        file_path = f"uploads/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return {"video_server_path": file_path}
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def extract_frames(video_path, interval=4):
    print("Extracting frames from video...", video_path)

    if(video_path.startswith("file://")):
        video_path = video_path[7:]

    cap = cv2.VideoCapture(video_path)
    frame_id = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        output_path = os.path.join(EXTRACTED_FRAMES_DIR, f"frame_{frame_id}.jpg")
        cv2.imwrite(output_path, frame)
        frame_id += 1

    cap.release()
    return sorted(os.listdir(EXTRACTED_FRAMES_DIR))

def process_with_detection(frames):
    print("Processing frames with hand detection...")
    selected_frames = process_frames(frames, SELECTED_FRAMES_DIR, threshold=0.05)
    return selected_frames

def encode_image_as_base64(image_path):
    with open(image_path, "rb") as image_file:
        result = base64.b64encode(image_file.read()).decode('utf-8')
        return result


def send_frames_to_gpt(frames):
    print("Sending frames to GPT...")

    
    context_words = "GREETINGS-HELLO"

    message_content = [
        {
            "type": "text",
            "text": f"Here are frames from a video of someone signing in ASL. Please analyze these images to identify whether the performed gesture is '{context_words}'. Please give a yes or no answer according to the similarity. If you think it is slightly similar, say yes. If you do not think this gesture is '{context_words}', give a suggestion about which sign this could be, and how the '{context_words}' is correctly signed in ASL. If you cannot identify the sign, please mention that as well and describe the movement. Please display your response as: 'The given prompt was.. and my answer is ..'"
        },
    ]

    # Add each frame as an image_url type to the message content
    for frame_path in frames:
        print("Adding frame to message content...")
        image_b64 = encode_image_as_base64(frame_path)
        message_content.append({
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{image_b64}"
            },
        })
    
    # Send the request to the OpenAI API
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are an expert in recognizing American Sign Language (ASL) gestures. You analyze images and describe the ASL gesture being performed."
            },
            {
                "role": "user",
                "content": message_content,
            },
        ],
        max_tokens=300,
    )

    return response.choices[0].message.content

def reduce_image_size_before_sending_to_gpt(frames):
    print("Reducing image size before sending to GPT...")
    for frame_path in frames:
        image = cv2.imread(frame_path)
        resized_image = cv2.resize(image, (512, 512))
        cv2.imwrite(frame_path, resized_image)

    return frames


# Main Workflow
@app.post("/process-video")
def process_user_video(request: VideoRequest):
    try:
        frames = extract_frames(request.video_url)
        selected_frames = process_with_detection(frames)
        reduced_frames = reduce_image_size_before_sending_to_gpt(selected_frames)
        gpt_results = send_frames_to_gpt(reduced_frames)
        print (gpt_results)
        # remove the extracted frames and selected frames in the directory without removing the directory
        for file in os.listdir(EXTRACTED_FRAMES_DIR):
            os.remove(os.path.join(EXTRACTED_FRAMES_DIR, file))
        for file in os.listdir(SELECTED_FRAMES_DIR):
            os.remove(os.path.join(SELECTED_FRAMES_DIR, file))
        return gpt_results
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    

if __name__ == "__main__":
    # capture the time spent on the process
    import uvicorn
    start_time = time.time()
    # Run the server on all network interfaces
    print(f"Time elapsed: {time.time() - start_time}")
    uvicorn.run(app, host="0.0.0.0", port=8000)