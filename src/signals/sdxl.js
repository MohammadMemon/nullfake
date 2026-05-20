const axios = require('axios');
const fs = require('fs');
const sharp = require('sharp');

async function runSDXLSignal(framePath) {
    try {
        const imageBuffer = await sharp(fs.readFileSync(framePath))
            .resize(384, 384, { fit: "fill" })
            .jpeg()
            .toBuffer();

        console.log("Image buffer size:", imageBuffer.length);

        console.log("Sending image buffer to SDXL signal server");

        const response = await axios.post('http://127.0.0.1:5001/predict/sdxl', imageBuffer, {
            headers: {
                'Content-Type': 'image/jpeg',
            },
        });

        console.log("Response:", response.data);

        return response.data;

    } catch (error) {
        console.error("Error running SDXL signal:", error);
        throw error;
    }
}

module.exports = {
    runSDXLSignal
}