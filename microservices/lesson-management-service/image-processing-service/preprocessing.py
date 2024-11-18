import os
import cv2
import numpy as np
from sklearn.model_selection import train_test_split

# Path to your ASL dataset
DATASET_PATH = '../asl_dataset'

def load_data():
    images = []  
    labels = []  
    label_map = {}  # Map class labels to integers
    current_label = 0

    for label in sorted(os.listdir(DATASET_PATH)):
        label_map[label] = current_label
        folder_path = os.path.join(DATASET_PATH, label)

        if not os.path.isdir(folder_path):
            continue

        for file in os.listdir(folder_path):
            img_path = os.path.join(folder_path, file)
            
            # Read the image 
            img = cv2.imread(img_path, cv2.IMREAD_COLOR)
            if img is None:
                continue  
            
            # Resize the image 
            img = cv2.resize(img, (128, 128))
            
            # Normalize the image 
            img = img / 255.0
            
            images.append(img)
            labels.append(current_label)

        current_label += 1

    images = np.array(images, dtype='float32')
    labels = np.array(labels)
    
    return images, labels, label_map

# 80-20 train-validation split
def split_data(images, labels):
    return train_test_split(images, labels, test_size=0.2, random_state=42)

# Running the script for testing
if __name__ == '__main__':
    images, labels, label_map = load_data()
    X_train, X_val, y_train, y_val = split_data(images, labels)
    print(f"Loaded {len(images)} images across {len(label_map)} classes.")
    print(f"Training data size: {len(X_train)}")
    print(f"Validation data size: {len(X_val)}")
