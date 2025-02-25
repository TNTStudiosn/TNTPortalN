import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import os from "os";
import { handleMicrosoftAuth } from "./auth";

let mainWindow: BrowserWindow | null;

const appDataPath = path.join(os.homedir(), "AppData", "Roaming", "TNTStudios");
const fristrunPath = path.join(appDataPath, "fristrun.json");
const configPath = path.join(appDataPath, "config.json");

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

    mainWindow.loadFile(path.join(__dirname, "../src/renderer/index.html"));

    ipcMain.handle("check-fristrun", () => {
        return !fs.existsSync(fristrunPath);
    });

    ipcMain.on("set-fristrun", () => {
        fs.writeFileSync(fristrunPath, JSON.stringify({ firstRun: false }, null, 2));
    });

    ipcMain.on("set-theme", (_event, theme) => {
        const config = { theme };
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    });

    ipcMain.handle("get-config", () => {
        if (fs.existsSync(configPath)) {
            return JSON.parse(fs.readFileSync(configPath, "utf-8"));
        }
        return { theme: "Default" };
    });

    ipcMain.on("navigate", (_event, page) => {
        mainWindow?.loadFile(path.join(__dirname, `../src/renderer/${page}`));
    });

    // 🔥 Inicializar autenticación de Microsoft en auth.ts
    handleMicrosoftAuth(mainWindow);

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });
});
