import { app, BrowserWindow } from "electron";
import path from "path";

let mainWindow: BrowserWindow | null;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        transparent: true, // Permite transparencia en la ventana
        frame: false,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, "../dist/preload.js"),
        },
    });

    mainWindow.loadFile(path.join(__dirname, "../src/renderer/index.html"));

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });
});
