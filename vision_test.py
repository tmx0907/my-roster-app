from google.cloud import vision  # pip install google-cloud-vision
import os

print("CREDS:", os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))

client = vision.ImageAnnotatorClient()

with open("image.jpg", "rb") as image_file:
    content = image_file.read()

image = vision.Image(content=content)
response = client.document_text_detection(image=image)

if response.error.message:
    raise RuntimeError(response.error.message)

print(response.full_text_annotation.text)
