import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import os from "os";

let mainWindow: BrowserWindow | null;
const appDataPath = path.join(os.homedir(), "AppData", "Roaming", "TNTStudios");
const fristrunPath = path.join(appDataPath, "fristrun.json");
const preloadPath = path.join(__dirname, "../dist/preload.js");
console.log("🔍 Ruta de preload.js:", preloadPath); // 🚀 DEPURACIÓN
function checkFirstRun(): boolean {
    if (!fs.existsSync(fristrunPath)) {
        return true;
    }
    return false;
}

app.whenReady().then(() => {
    // Crear la carpeta si no existe
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
            preload: preloadPath,  // 🚀 Asegurar la ruta correcta
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
        },
               
    });

    // Cargar la pantalla de bienvenida si es la primera vez, de lo contrario, ir a main.html
    const startPage = checkFirstRun() 
        ? path.join(__dirname, "../src/renderer/welcome.html") 
        : path.join(__dirname, "../src/renderer/main.html");

    mainWindow.loadFile(startPage);

    // Evento para verificar fristrun desde el renderer
    ipcMain.handle("check-fristrun", () => {
        return checkFirstRun();
    });

    // Evento para marcar fristrun como completado
    ipcMain.on("set-fristrun", () => {
        fs.writeFileSync(fristrunPath, JSON.stringify({ firstRun: false }, null, 2));
    });

    // Control de la ventana
    ipcMain.on("window-minimize", () => {
        if (mainWindow) mainWindow.minimize();
    });

    ipcMain.on("window-maximize", () => {
        if (mainWindow) {
            if (mainWindow.isMaximized()) {
                mainWindow.unmaximize();
            } else {
                mainWindow.maximize();
            }
        }
    });

    ipcMain.on("window-close", () => {
        if (mainWindow) mainWindow.close();
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });
});
