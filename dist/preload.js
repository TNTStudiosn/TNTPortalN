"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("electron", {
    checkFirstRun: () => electron_1.ipcRenderer.invoke("check-fristrun"),
    setFirstRun: () => electron_1.ipcRenderer.send("set-fristrun"),
});
