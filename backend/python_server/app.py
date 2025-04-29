import ast
import numpy as np
import cv2
import base64

from flask import Flask, request, jsonify

app = Flask(__name__)

def decode_jpeg_compressed_data(jpeg_data):
    if not isinstance(jpeg_data, bytes):
        binary_data = ast.literal_eval(jpeg_data)
        jpeg_data = bytes(binary_data)
    np_arr = np.frombuffer(jpeg_data, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return img

@app.route('/decode-image', methods=['POST'])
def decode_image():
    try:
        data = request.get_json()
        raw_data_str = data.get("jpeg_data")

        img = decode_jpeg_compressed_data(raw_data_str)
        if img is None:
            return jsonify({"status": "error", "message": "Decode failed"}), 400

        # Encode image to JPEG and base64
        _, buffer = cv2.imencode('.jpg', img)
        full_image_base64 = base64.b64encode(buffer).decode('utf-8')

        height, width, channels = img.shape
        return jsonify({
            "status": "ok",
            "shape": [height, width, channels],
            "image_base64": f"data:image/jpeg;base64,{full_image_base64}"
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)
