import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";

let mainWindow: BrowserWindow | null;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        frame: false,
        resizable: false,
        transparent: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true, // Asegura seguridad
            enableRemoteModule: false,
            nodeIntegration: false
        },
    });

    mainWindow.loadFile(path.join(__dirname, "../renderer/main.html"));

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
