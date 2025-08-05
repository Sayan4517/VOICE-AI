from flask import Flask, request, jsonify,render_template
import requests
import os
from dotenv import load_dotenv

load_dotenv()  

app = Flask(__name__)
MURF_API_KEY = os.getenv("MURF_API_KEY")
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/generate-audio", methods=["POST"])
def generate_audio():
    data = request.get_json()
    input_text = data.get("text")

    headers = {
       
        "api-key": MURF_API_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        
  "voiceId": "en-US-terrell",
  "text": input_text


    }

    murf_api_url = "https://api.murf.ai/v1/speech/generate"
    response = requests.post(murf_api_url, headers=headers, json=payload)

    if response.status_code == 200:
        response_data = response.json()
        audio_url = response_data.get("audioFile") 
        return jsonify({"audio_url": audio_url})
    else:
        return jsonify({
            "error": "Failed to generate audio",
            "status_code": response.status_code,
            "response": response.text
        }), response.status_code

if __name__ == "__main__":
    app.run(debug=True)
