import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import os from "os";

let mainWindow: BrowserWindow | null;

const appDataPath = path.join(os.homedir(), "AppData", "Roaming", "TNTStudios");
const fristrunPath = path.join(appDataPath, "fristrun.json");
const configPath = path.join(appDataPath, "config.json"); // Para guardar el tema seleccionado

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

    // ✅ Verifica si es la primera vez que se ejecuta
    ipcMain.handle("check-fristrun", () => {
        return !fs.existsSync(fristrunPath);
    });

    // ✅ Guarda que el usuario ya pasó la bienvenida
    ipcMain.on("set-fristrun", () => {
        fs.writeFileSync(fristrunPath, JSON.stringify({ firstRun: false }, null, 2));
    });

    // ✅ Guardar el tema seleccionado
    ipcMain.on("set-theme", (_event, theme) => {
        const config = { theme };
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    });

    // ✅ Obtener la configuración (tema seleccionado)
    ipcMain.handle("get-config", () => {
        if (fs.existsSync(configPath)) {
            return JSON.parse(fs.readFileSync(configPath, "utf-8"));
        }
        return { theme: "Default" }; // 🔥 Si no hay configuración, usar "Default"
    });

    // ✅ Nueva función para navegar entre páginas en la misma ventana
    ipcMain.on("navigate", (_event, page) => {
        mainWindow?.loadFile(path.join(__dirname, `../src/renderer/${page}`));
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });
});
