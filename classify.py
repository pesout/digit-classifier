import sys
import numpy as np
import requests
import json
from io import BytesIO
from PIL import Image
from PIL import ImageEnhance, ImageOps
from tensorflow.keras.models import load_model

# Load the model
model = load_model("saved_network.h5")

# URL of the PNG image
filename = sys.argv[1];
image_url = f"http://localhost/image-classify/uploads/{filename}"

# Download the image
response = requests.get(image_url)
img = Image.open(BytesIO(response.content))

# Convert to RGB from RGBA
if img.mode != 'RGB': img = img.convert('RGB')

# Preprocess the image
img = ImageOps.invert(img)  # Invert colors
img = img.resize((28, 28))  # Resize to 28x28
img = img.convert("L")      # Convert to grayscale

# Enhance contrast
contrast_enhancer = ImageEnhance.Contrast(img)
img = contrast_enhancer.enhance(4.0)

img_array = np.array(img)       # Convert to numpy array
img_array = img_array / 255.0   # Normalize pixel values
img_array = img_array.reshape(1, 28, 28, 1)  # Reshape for model input

# Predict the class
probabilities = model.predict(img_array)[0]

# Create a dictionary of class probabilities
probabilities_dict = {f"Number {i}": round(float(prob) * 100, 2) for i, prob in enumerate(probabilities)}

# Convert the dictionary to a JSON string
probabilities_json = json.dumps(probabilities_dict)

# Print the JSON string
print(probabilities_json)
