import os
import numpy as np
import cv2
import tensorflow as tf
from flask import Flask, request, jsonify

# Initialize Flask app
app = Flask(__name__)

# Load the trained model
model_path = os.path.join(os.path.dirname(__file__), '../microservices/lesson-management-service/image-processing-service/img_processing_model.keras')
print("Loading model from:", model_path)
model = tf.keras.models.load_model(model_path)
print("Model loaded successfully.")

# Function to preprocess the uploaded image
def preprocess_image(image_bytes):
    print("Starting image preprocessing...")
    
    # Convert the image bytes to a NumPy array
    np_image = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_image, cv2.IMREAD_COLOR)
    
    # Check if the image is loaded successfully
    if img is None:
        raise ValueError("Image could not be loaded. Ensure the image file is valid.")
    print("Image loaded successfully.")
    
    # Resize and normalize the image
    img = cv2.resize(img, (128, 128))
    print("Image resized to 128x128.")
    img = img / 255.0  # Normalize pixel values to [0, 1]
    print("Image normalized.")
    
    # Expand dimensions to match the model input shape
    img = np.expand_dims(img, axis=0)
    print("Image shape after preprocessing:", img.shape)
    
    return img

# API endpoint for prediction
@app.route('/predict', methods=['POST'])
def predict():
    print("Received a request at /predict")
    
    if 'image' not in request.files:
        print("No image file found in the request.")
        return jsonify({'error': 'No image file uploaded'}), 400

    try:
        # Read the image
        print("Reading the image file...")
        image_file = request.files['image'].read()
        print("Image file read successfully. Starting preprocessing...")
        preprocessed_image = preprocess_image(image_file)
        
        # Make a prediction
        print("Running model prediction...")
        predictions = model.predict(preprocessed_image)
        predicted_class = int(np.argmax(predictions))
        confidence = float(np.max(predictions))
        print(f"Prediction complete. Gesture: {predicted_class}, Confidence: {confidence}")
        
        # Return the result as JSON
        return jsonify({'gesture': predicted_class, 'confidence': confidence})
    
    except Exception as e:
        print("An error occurred:", str(e))
        return jsonify({'error': str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5001)
    print("Flask server is running.")
