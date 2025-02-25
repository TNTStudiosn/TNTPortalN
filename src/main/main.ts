import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import os from "os";

let mainWindow: BrowserWindow | null;

const appDataPath = path.join(os.homedir(), "AppData", "Roaming", "TNTStudios");
const configPath = path.join(appDataPath, "config.json");

// Crear la carpeta si no existe
if (!fs.existsSync(appDataPath)) {
    fs.mkdirSync(appDataPath, { recursive: true });
}

// Guardar el tema seleccionado
ipcMain.on("set-theme", (_event, theme) => {
    const config = { theme };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
});

// Cargar el tema guardado en `main.html`
function getSavedTheme(): string {
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        return config.theme || "default";
    }
    return "default";
}

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1056,
        height: 594,
        frame: false,
        resizable: false,
        transparent: true,
        webPreferences: {
            preload: path.join(__dirname, "../dist/preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
        },
    });

    mainWindow.loadFile(path.join(__dirname, "../src/renderer/index.html"));
});
