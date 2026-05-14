const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {

  // renderer → main
  openVideo: (movieName) =>
    ipcRenderer.send("open-video", movieName),

  // main → renderer (video window)
  onVideo: (callback) => {
    ipcRenderer.removeAllListeners("set-video");

    ipcRenderer.on("set-video", (event, data) => {
      callback(data);
    });
  },

  closeVideo: () =>
    ipcRenderer.send("close-video"),

  saveProgress: (data) =>
    ipcRenderer.send("save-progress", data),


});