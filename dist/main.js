"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
let mainWindow;
const appDataPath = path_1.default.join(os_1.default.homedir(), "AppData", "Roaming", "TNTStudios");
const fristrunPath = path_1.default.join(appDataPath, "fristrun.json");
const configPath = path_1.default.join(appDataPath, "config.json"); // Para guardar el tema seleccionado
const preloadPath = path_1.default.join(__dirname, "../dist/preload.js");
electron_1.app.whenReady().then(() => {
    if (!fs_1.default.existsSync(appDataPath)) {
        fs_1.default.mkdirSync(appDataPath, { recursive: true });
    }
    mainWindow = new electron_1.BrowserWindow({
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
    mainWindow.loadFile(path_1.default.join(__dirname, "../src/renderer/index.html"));
    electron_1.ipcMain.handle("check-fristrun", () => {
        return !fs_1.default.existsSync(fristrunPath);
    });
    electron_1.ipcMain.on("set-fristrun", () => {
        fs_1.default.writeFileSync(fristrunPath, JSON.stringify({ firstRun: false }, null, 2));
    });
    // Guardar el tema seleccionado
    electron_1.ipcMain.on("set-theme", (_event, theme) => {
        const config = { theme };
        fs_1.default.writeFileSync(configPath, JSON.stringify(config, null, 2));
    });
    // 🔥 Nueva función para navegar entre páginas en la misma ventana
    electron_1.ipcMain.on("navigate", (_event, page) => {
        mainWindow?.loadFile(path_1.default.join(__dirname, `../src/renderer/${page}`));
    });
    electron_1.app.on("window-all-closed", () => {
        if (process.platform !== "darwin")
            electron_1.app.quit();
    });
});
