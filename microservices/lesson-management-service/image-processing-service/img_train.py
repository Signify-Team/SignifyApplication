import numpy as np
from img_model import create_gesture_recognition_model
from img_preprocessing import load_data, split_data

# Load and split the data
images, labels, label_map = load_data()
X_train, X_val, y_train, y_val = split_data(images, labels)
print(f"Training set size: {len(X_train)} images")
print(f"Validation set size: {len(X_val)} images")

# Create 
model = create_gesture_recognition_model()
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Train
history = model.fit(X_train, y_train, epochs=10, validation_data=(X_val, y_val))
print("Model training complete.")

# Save 
model.save('img_processing_model.keras')
print("Model saved successfully as 'img_processing_model.keras'")
