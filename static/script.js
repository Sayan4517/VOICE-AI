function submitText() {
  const text = document.getElementById('textInput').value;
  const status = document.getElementById('status');
  const audio = document.getElementById('audioPlayer');

  if (!text.trim()) {
    status.innerText = " Please enter some text.";
    return;
  }

  status.innerText = " Generating audio...";
  fetch("/generate-audio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: text })
  })
  .then(res => res.json())
  .then(data => {
    if (data.audio_url) {
      audio.src = data.audio_url;
      audio.classList.remove("d-none");
      status.innerText = " Audio is ready. Click play!";
    } else {
      status.innerText = " Error generating audio.";
    }
  })
  .catch(err => {
    console.error(err);
    status.innerText = " Failed to connect to the server.";
  });
}
// ECHO BOT – MediaRecorder logic
let mediaRecorder;
let recordedChunks = [];

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const recordingStatus = document.getElementById("recordingStatus");
const echoPlayer = document.getElementById("echoPlayer");

startBtn.addEventListener("click", async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  recordedChunks = [];
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: 'audio/webm' });
    const audioURL = URL.createObjectURL(blob);
    echoPlayer.src = audioURL;
    echoPlayer.classList.remove("hidden");
    recordingStatus.innerText = " Recording complete! Press play to listen.";
  };

  mediaRecorder.start();
  startBtn.disabled = true;
  stopBtn.disabled = false;
  recordingStatus.innerText = "⏺️ Recording...";
});

stopBtn.addEventListener("click", () => {
  mediaRecorder.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
  recordingStatus.innerText = "🔄 Processing...";
});
