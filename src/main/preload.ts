import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
    checkFirstRun: () => ipcRenderer.invoke("check-fristrun"),
    setFirstRun: () => ipcRenderer.send("set-fristrun"),
});
