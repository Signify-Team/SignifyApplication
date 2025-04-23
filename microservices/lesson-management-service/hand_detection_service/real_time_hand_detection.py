import cv2
import sys
import mediapipe as mp
import numpy as np
import os
import pickle
import json

# Set environment variable to force CPU usage
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'  # Disable GPU
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Reduce TensorFlow logging

# Initialize MediaPipe Hands with CPU-only mode
mp_hands = mp.solutions.hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5,
    model_complexity=0  # Use lightweight model
)

STATE_FILE = "prev_landmarks.pkl"
THRESHOLD_SMALL = 0.001
THRESHOLD_MODERATE = 0.05
THRESHOLD_LARGE = 0.1
MIN_FRAME_DISTANCE = 1

# Helper function to calculate Euclidean distance
def euclidean_distance(pt1, pt2):
    return np.linalg.norm(np.array(pt1) - np.array(pt2))

# Extract landmarks from a frame
def extract_landmarks(frame):
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = mp_hands.process(frame_rgb)
    if not results.multi_hand_landmarks:
        return None  # No hand detected
    landmarks = []
    for hand_landmarks in results.multi_hand_landmarks:
        for landmark in hand_landmarks.landmark:
            landmarks.append((landmark.x, landmark.y, landmark.z))
    return landmarks


# Analyze movement between two sets of landmarks
def calculate_hand_movement(prev_landmarks, current_landmarks):
    if not current_landmarks:
        return 0
    if not prev_landmarks:
        return float("inf")  # Large movement for initialization
    distances = [
        euclidean_distance(prev_landmarks[i], current_landmarks[i])
        for i in range(min(len(prev_landmarks), len(current_landmarks)))
    ]
    result = sum(distances) / len(distances)
    print(f"Distance results: {result}")
    return result

# Process a single frame
def process_frame(frame, prev_landmarks, last_selected_landmarks, threshold=THRESHOLD_SMALL, min_frame_distance=MIN_FRAME_DISTANCE, frame_index=0):
    current_landmarks = extract_landmarks(frame)
    if current_landmarks is None:
        return False, prev_landmarks, last_selected_landmarks

    # Calculate movement
    movement = calculate_hand_movement(prev_landmarks, current_landmarks)
    
    # Avoid redundancy by comparing with the last selected frame
    if last_selected_landmarks:
        similarity = calculate_hand_movement(last_selected_landmarks, current_landmarks)
        print(f"Similarity: {similarity}")
        if similarity < threshold and frame_index % min_frame_distance != 0:
            return False, current_landmarks, last_selected_landmarks # Skip frame

    print(f"Movement: {movement}")
    # Select frame if movement exceeds threshold
    is_selected = movement > threshold
    return is_selected, current_landmarks, current_landmarks if is_selected else last_selected_landmarks

def process_frames(frames, output_dir, threshold=THRESHOLD_SMALL, min_frame_distance=MIN_FRAME_DISTANCE):
    os.makedirs(output_dir, exist_ok=True)
    selected_frames = []
    prev_landmarks = None
    last_selected_landmarks = None

    for i, frame_path in enumerate(frames):
        # Extract the original frame number from the frame filename
        original_frame_number = os.path.splitext(os.path.basename(frame_path))[0]

        # Load the frame
        frame_path = os.path.join("extracted_frames", frame_path)
        frame = cv2.imread(frame_path)
        if frame is None:
            print(f"Error: Could not load frame from {frame_path}", file=sys.stderr)
            continue

        # Process the frame
        is_selected, prev_landmarks, last_selected_landmarks = process_frame(
            frame, prev_landmarks, last_selected_landmarks, threshold, min_frame_distance, i
        )

        if is_selected:
            # Save the selected frame with its original frame number
            output_path = os.path.join(output_dir, f"selected_frame_{original_frame_number}.jpg")
            cv2.imwrite(output_path, frame)
            selected_frames.append(output_path)

    return selected_frames