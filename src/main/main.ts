import { app, BrowserWindow } from "electron";
import path from "path";

let mainWindow: BrowserWindow | null;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "../dist/preload.js"), // 🔹 Apunta a dist/preload.js
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../src/renderer/index.html")); // 🔹 Ruta correcta del HTML

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
});
