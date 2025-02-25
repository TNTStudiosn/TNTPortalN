"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
console.log("✅ preload.js cargado correctamente"); // 🚀 Depuración
electron_1.contextBridge.exposeInMainWorld("electron", {
    minimize: () => electron_1.ipcRenderer.send("window-minimize"),
    maximize: () => electron_1.ipcRenderer.send("window-maximize"),
    close: () => electron_1.ipcRenderer.send("window-close"),
    checkFirstRun: () => electron_1.ipcRenderer.invoke("check-fristrun"),
    setFirstRun: () => electron_1.ipcRenderer.send("set-fristrun"),
});
