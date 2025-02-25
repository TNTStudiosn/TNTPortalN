import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import os from "os";

let mainWindow: BrowserWindow | null;

const appDataPath = path.join(os.homedir(), "AppData", "Roaming", "TNTStudios");
const fristrunPath = path.join(appDataPath, "fristrun.json");

const preloadPath = path.join(__dirname, "../dist/preload.js");

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
            preload: preloadPath,
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
        },
    });

    // 🔥 Siempre carga index.html primero para mostrar la animación del logo
    mainWindow.loadFile(path.join(__dirname, "../src/renderer/index.html"));

    ipcMain.handle("check-fristrun", () => {
        return !fs.existsSync(fristrunPath);
    });

    ipcMain.on("set-fristrun", () => {
        fs.writeFileSync(fristrunPath, JSON.stringify({ firstRun: false }, null, 2));
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });
});
