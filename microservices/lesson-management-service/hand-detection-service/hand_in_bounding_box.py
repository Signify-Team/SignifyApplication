import os
import cv2
import scipy.io
import numpy as np

# Path to a sample .mat file
sample_mat_file = "egohands_dataset/_LABELLED_SAMPLES/PUZZLE_OFFICE_T_S/polygons.mat"  # Update this path
print("file directory: ", os.path.dirname(sample_mat_file))
print("file name: ", os.path.basename(sample_mat_file))

# Load the .mat file
mat_data = scipy.io.loadmat(sample_mat_file)

# Print the keys in the .mat file
print("Keys in .mat file:", mat_data.keys())

# Inspect the data structure
for key in mat_data:
    print(f"{key}: {type(mat_data[key])}, shape: {getattr(mat_data[key], 'shape', None)}")

print("\n\n\n\n")

# Paths to EgoHands dataset
dataset_dir = "egohands_dataset/_LABELLED_SAMPLES"  # Update this with your dataset path
output_dir = "processed_dataset"
os.makedirs(output_dir, exist_ok=True)

def extract_bounding_boxes_from_polygons(polygons):
    """Convert polygons to bounding boxes."""
    boxes = []
    for polygon in polygons:
        if polygon.size == 0:  # Skip empty polygons
            print("Empty polygon, skipping...")
            continue

        # Convert polygon to NumPy array and ensure correct format
        polygon = np.array(polygon, dtype=np.int32)  # Ensure points are integers
        if polygon.ndim != 2 or polygon.shape[1] != 2:  # Ensure valid 2D coordinates
            print(f"Invalid polygon shape: {polygon.shape}, skipping...")
            continue

        # Get bounding box
        x, y, w, h = cv2.boundingRect(polygon)
        boxes.append((x, y, x + w, y + h))  # (x_min, y_min, x_max, y_max)
    return boxes


def process_dataset():
    """Process EgoHands dataset and create bounding boxes."""
    for folder in os.listdir(dataset_dir):
        folder_path = os.path.join(dataset_dir, folder)
        if not os.path.isdir(folder_path):
            continue

        for file in os.listdir(folder_path):
            if file == "polygons.mat":  # Only process the polygons.mat file
                mat_path = os.path.join(folder_path, file)

                # Load MATLAB annotation file
                mat_data = scipy.io.loadmat(mat_path)

                # Extract polygons
                polygons = mat_data["polygons"][0]  # List of polygon arrays
                frame_names = sorted(
                    [f for f in os.listdir(folder_path) if f.endswith(".jpg")]
                )  # Corresponding frame filenames

                for i, frame_name in enumerate(frame_names):
                    frame_path = os.path.join(folder_path, frame_name)
                    image = cv2.imread(frame_path)
                    if image is None:
                        print(f"Frame {frame_name} not found!")
                        continue

                    # Extract polygons for this frame
                    frame_polygons = polygons[i]
                    bounding_boxes = extract_bounding_boxes_from_polygons(frame_polygons)

                    # Draw bounding boxes on the image
                    for (x_min, y_min, x_max, y_max) in bounding_boxes:
                        cv2.rectangle(
                            image, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2
                        )

                    # Save the processed frame
                    output_path = os.path.join(output_dir, f"{folder}_{frame_name}")
                    cv2.imwrite(output_path, image)
                    print(f"Processed and saved: {output_path}")

process_dataset()