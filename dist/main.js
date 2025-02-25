"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
let mainWindow;
electron_1.app.whenReady().then(() => {
    mainWindow = new electron_1.BrowserWindow({
        width: 960,
        height: 540,
        transparent: true,
        frame: false,
        resizable: false,
        webPreferences: {
            preload: path_1.default.join(__dirname, "preload.js"),
        },
    });
    mainWindow.loadFile("src/renderer/index.html");
    electron_1.app.on("window-all-closed", () => {
        if (process.platform !== "darwin")
            electron_1.app.quit();
    });
});
