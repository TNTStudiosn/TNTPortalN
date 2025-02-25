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
// ✅ Asegura que preload.js se carga desde "dist"
const preloadPath = path_1.default.join(__dirname, "../dist/preload.js");
console.log("🔍 Ruta de preload.js:", preloadPath);
console.log("📂 Existe preload.js:", fs_1.default.existsSync(preloadPath));
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
            preload: preloadPath, // ✅ Ruta corregida
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
        },
    });
    // ✅ Usar la ruta correcta para la página de inicio
    const startPage = fs_1.default.existsSync(fristrunPath)
        ? path_1.default.join(__dirname, "../src/renderer/main.html")
        : path_1.default.join(__dirname, "../src/renderer/welcome.html");
    console.log("📂 Página de inicio:", startPage);
    mainWindow.loadFile(startPage);
    electron_1.ipcMain.on("set-fristrun", () => {
        fs_1.default.writeFileSync(fristrunPath, JSON.stringify({ firstRun: false }, null, 2));
    });
    electron_1.app.on("window-all-closed", () => {
        if (process.platform !== "darwin")
            electron_1.app.quit();
    });
});
