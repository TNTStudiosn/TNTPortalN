import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
    checkFirstRun: () => ipcRenderer.invoke("check-fristrun"),
    setFirstRun: () => ipcRenderer.send("set-fristrun"),
    setTheme: (theme: string) => ipcRenderer.send("set-theme", theme),
    navigate: (page: string) => ipcRenderer.send("navigate", page),
    startMicrosoftLogin: () => ipcRenderer.send("start-microsoft-login"),
    onMicrosoftLoginSuccess: (callback: (userData: any) => void) => 
        ipcRenderer.on("microsoft-login-success", (_event, userData) => callback(userData)),
});
