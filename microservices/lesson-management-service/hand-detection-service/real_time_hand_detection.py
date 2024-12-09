"""
@File: real_time_hand_detection.py
@Title: Real-Time Hand Detection
@Description: This script is used to detect hands in real-time using the MediaPipe Hands model.
@Author: Deniz Polat
@Date: 2021-07-06
"""
import cv2 
import mediapipe as mp

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

# hands model for non static images (videos)
hands_non_static = mp_hands.Hands(
    static_image_mode=False,  # Use static images (True) or video frames (False)
    max_num_hands=2,         # Maximum number of hands to detect
    min_detection_confidence=0.5,  # Minimum detection confidence
    min_tracking_confidence=0.5    # Minimum tracking confidence
)

# hands model for static images
'''
NOTE: THIS MODEL IS NOT USED IN THIS SCRIPT. 
      IT CAN BE USED IN FURTHER IMPLEMENTATIONS FOR STATIC HAND SIGN DETECTION.
      (OPTIONAL)
'''
hands_static = mp_hands.Hands(
    static_image_mode=True,  # Use static images (True) or video frames (False)
    max_num_hands=2,         # Maximum number of hands to detect (can be changed to 1 but i dont recommend it)
    min_detection_confidence=0.5,  # Minimum detection confidence (0.5 is default)
    # no tracking confidence for static images
)

useCamera = True
cap = None

if useCamera:
    cap = cv2.VideoCapture(0) #initialize web cam for computer testing (0 for default camera)
else:
    # THESE VARIABLES ARE USED FOR VIDEO OUTPUT
    input_video_path = "greetings_goodbye_1.mp4"  # Input video file EXAMPLE
    output_video_path = "greetings_goodbye_1_output.mp4"  # Output video file EXAMPLE
    cap = cv2.VideoCapture(input_video_path)

    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")  # Codec for .mp4 format
    out = cv2.VideoWriter(output_video_path, fourcc, fps, (frame_width, frame_height))

while cap.isOpened():
    ret, frame = cap.read() # read the frame
    if not ret:
        break

    # mediapipe hands processes RGB images
    # convert the frame to rgb
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    results = hands_non_static.process(frame_rgb)

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:

            # each hand has 21 landmarks, consistsng of x, y, z coordinates
            landmarks = [(lm.x, lm.y, lm.z) for lm in hand_landmarks.landmark]
            # print("Hand Landmarks:", landmarks) # print the landmarks but i'm commenting it out because it's too much

            # draw landmarks using mediapipe drawing utilities
            mp_drawing.draw_landmarks(
                frame, hand_landmarks, mp_hands.HAND_CONNECTIONS,
                mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=2, circle_radius=2)
            )

            # BOUNDING BOX CALCULATION (OPTIONAL)
            h, w, _ = frame.shape
            x_min = int(min([lm.x for lm in hand_landmarks.landmark]) * w)
            y_min = int(min([lm.y for lm in hand_landmarks.landmark]) * h)
            x_max = int(max([lm.x for lm in hand_landmarks.landmark]) * w)
            y_max = int(max([lm.y for lm in hand_landmarks.landmark]) * h)

            cv2.rectangle(frame, (x_min, y_min), (x_max, y_max), (255, 0, 0), 2) # draw bounding box 

    # display the frame with landmarks and bounding box
    if useCamera:
        cv2.imshow("MediaPipe Hands", frame)
    else:
        #save output to file in mp4 format
        out.write(frame)


    if cv2.waitKey(1) & 0xFF == ord('q'): # press q to quit
        break

#SOURCE RELEASE (MANDATORY!!!!!!!!!)
if useCamera:
    cap.release()
if not useCamera:
    out.release()
cv2.destroyAllWindows()
hands_non_static.close()
hands_static.close() # NOT USED IN THIS SCRIPT BUT CAN BE USED IN FURTHER IMPLEMENTATIONS.
