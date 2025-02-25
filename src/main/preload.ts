import { contextBridge, ipcRenderer } from "electron";

console.log("✅ preload.js cargado correctamente");  // 🚀 Depuración

contextBridge.exposeInMainWorld("electron", {
    minimize: () => ipcRenderer.send("window-minimize"),
    maximize: () => ipcRenderer.send("window-maximize"),
    close: () => ipcRenderer.send("window-close"),
    checkFirstRun: () => ipcRenderer.invoke("check-fristrun"),
    setFirstRun: () => ipcRenderer.send("set-fristrun"),
});
