const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
let backendProcess;
let currentMovie = "";
let videowin = null;
const vosk = require("vosk");
const record = require("node-record-lpcm16");
//main voice recognition code using vosk model
const modelPath = path.join(__dirname, "vosk-model-small-en-in-0.4");
const model = new vosk.Model(modelPath);
const rec = new vosk.Recognizer({ model, sampleRate: 16000 });
rec.setMaxAlternatives(0);
rec.setWords(true);
let mic = null;
function startRecognition(mainWindow) {
  rec.reset();

  mic = record.record({
    sampleRateHertz: 16000,
    recordProgram: "arecord",
    audioType: "raw",
  });

  mic.stream().on("data", (data) => {
    rec.acceptWaveform(data);

    const partial = rec.partialResult();
    if (partial && partial.partial) {
      console.log("partial:", partial.partial);
    }
  });

  setTimeout(() => {
    const result = rec.finalResult();

    if (result.text) {
      mainWindow.webContents.send("voice-input", result.text);
    }

    stopRecognition();
  }, 5000);

  console.log("Vosk started for 5 seconds");
}
function stopRecognition() {
  if (mic) {
    mic.stop();
    mic = null;
  }

  console.log("Vosk stopped");
}

console.log("main process started");

// ---------------- JSON HELPERS ----------------

function load_movies() {
  const filePath = path.join(__dirname, "../backend/movies.json");

  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function save_movies(movies) {
  const filePath = path.join(__dirname, "../backend/movies.json");

  fs.writeFileSync(
    filePath,
    JSON.stringify(movies, null, 2)
  );
}

// ---------------- MAIN WINDOW ----------------

function createWindow() {

  const win = new BrowserWindow({

    width: 1000,
    height: 700,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }

  });

  win.loadFile(path.join(__dirname, "index.html"));
}

// ---------------- VIDEO WINDOW ----------------

function openVideoWindow(movieName) {

  currentMovie = movieName;

  videowin = new BrowserWindow({

    fullscreen: true,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }

  });

  const videoPath = path.join(__dirname, "videoplayer.html");

  videowin.loadFile(videoPath);

  videowin.webContents.on("did-finish-load", () => {

    const movies = load_movies();
    const movieData = movies[movieName];

    if (!movieData) {
      console.error("Movie not found:", movieName);
      return;
    }

    videowin.webContents.send("set-video", {
      file: movieData.file,
      last_watched: movieData.last_watched || 0
    });

  });
}

// ---------------- IPC HANDLERS ----------------

// open video
ipcMain.on("open-video", (event, movieName) => {
  openVideoWindow(movieName);
});

// get current movie
ipcMain.handle("get-movie", () => {
  return currentMovie;
});

// close video
ipcMain.on("close-video", () => {

  if (videowin) {
    videowin.close();
    videowin = null;
  }

});

// save progress
ipcMain.on("save-progress", (event, data) => {

  console.log("Saving progress:", data);

  const movies = load_movies();

  if (movies[data.name]) {

    movies[data.name].last_watched = data.time;
    save_movies(movies);
  }

});
ipcMain.on("start-voice", (event) => {
  const win = BrowserWindow.getFocusedWindow();
  startRecognition(win);
});


// ---------------- BACKEND ----------------



function startBackend() {
const pythonCommand = path.join(__dirname, "../backend/venv/bin/python");



 backendProcess = spawn(
  pythonCommand,
  [
    "-m",
    "uvicorn",
    "main:app",
    "--host",
    "127.0.0.1",
    "--port",
    "8000"
  ],
  {
    cwd: path.join(__dirname, "../backend"),
    shell: false
  }
);
  if (!backendProcess) {
    console.error("Failed to start backend process");
    return;
  }
  backendProcess.stdout.on("data", (data) => {
    console.log(`PYTHON: ${data}`);
  });

  backendProcess.stderr.on("data", (data) => {
    console.error(`ERROR: ${data}`);
  });

}
async function waitForBackend() {

  let started = false;

  while (!started) {

    try {

      await axios.get("http://127.0.0.1:8000/status");

      started = true;

      console.log("Backend ready");

    } catch {

      console.log("Waiting for backend...");

      await new Promise(resolve =>
        setTimeout(resolve, 1000)
      );

    }

  }

}

// ---------------- APP LIFECYCLE ----------------

app.whenReady().then(async () => {

  startBackend();

  await waitForBackend();

  createWindow();

});
app.on("before-quit", () => {
  if (backendProcess) {

    backendProcess.kill();
  console.log("backend closed")
  }
});
