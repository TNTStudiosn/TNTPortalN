"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("electron", {
    checkFirstRun: () => electron_1.ipcRenderer.invoke("check-fristrun"),
    setFirstRun: () => electron_1.ipcRenderer.send("set-fristrun"),
    setTheme: (theme) => electron_1.ipcRenderer.send("set-theme", theme),
    navigate: (page) => electron_1.ipcRenderer.send("navigate", page),
    startMicrosoftLogin: () => electron_1.ipcRenderer.send("start-microsoft-login"),
    onMicrosoftLoginSuccess: (callback) => electron_1.ipcRenderer.on("microsoft-login-success", (_event, userData) => callback(userData)),
});
