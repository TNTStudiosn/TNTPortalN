import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import os from "os";

let mainWindow: BrowserWindow | null;

const appDataPath = path.join(os.homedir(), "AppData", "Roaming", "TNTStudios");
const fristrunPath = path.join(appDataPath, "fristrun.json");

// 🔍 Depuración de rutas
const preloadPath = path.join(__dirname, "preload.js");
console.log("🔍 Ruta de preload.js:", preloadPath);
console.log("📂 Existe preload.js:", fs.existsSync(preloadPath));

app.whenReady().then(() => {
    if (!fs.existsSync(appDataPath)) {
        fs.mkdirSync(appDataPath, { recursive: true });
    }

    mainWindow = new BrowserWindow({
        width: 1056,
        height: 594,
        frame: false,
        resizable: false,
        transparent: true,
        webPreferences: {
            preload: preloadPath, // ✅ Usar variable para ver ruta real
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
        },
    });

    const startPage = fs.existsSync(fristrunPath) 
        ? path.join(__dirname, "../src/renderer/main.html") 
        : path.join(__dirname, "../src/renderer/welcome.html");

    mainWindow.loadFile(startPage);
});
