from fastapi import FastAPI, Request
from transformers import pipeline
from PIL import Image
import io

app = FastAPI()

print("Loading models...")
sdxl_detector = pipeline("image-classification", model="Organika/sdxl-detector")
print("Models ready")

@app.post("/predict/sdxl")
async def predict_sdxl(request: Request):
    image_bytes = await request.body()
    image = Image.open(io.BytesIO(image_bytes))
    return sdxl_detector(image)
