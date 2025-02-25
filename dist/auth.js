"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMicrosoftAuth = handleMicrosoftAuth;
const electron_1 = require("electron");
const electron_store_1 = __importDefault(require("electron-store"));
const open_1 = __importDefault(require("open"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
// ✅ Inicializar `electron-store` correctamente
const store = new electron_store_1.default();
// 🔥 Configuración de Microsoft OAuth2
const CLIENT_ID = "7b62a47b-a95a-450d-ba0f-c4d8d0cac62b"; // Reemplázalo con tu Client ID de Azure
const REDIRECT_URI = "https://login.microsoftonline.com/common/oauth2/nativeclient";
const AUTH_URL = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=XboxLive.signin offline_access openid profile`;
/**
 * 📌 Maneja la autenticación de Microsoft en Electron.
 */
function handleMicrosoftAuth(mainWindow) {
    electron_1.ipcMain.on("start-microsoft-login", async () => {
        try {
            await (0, open_1.default)(AUTH_URL); // 🔥 Abre la autenticación en el navegador
            const authWindow = new electron_1.BrowserWindow({
                width: 500,
                height: 600,
                frame: false, // 🔥 Sin barra de menú
                resizable: false,
                alwaysOnTop: true,
                webPreferences: {
                    nodeIntegration: false,
                },
            });
            authWindow.loadURL(REDIRECT_URI);
            authWindow.webContents.on("will-redirect", (_event, url) => {
                const authCode = extractAuthCode(url);
                if (authCode) {
                    authWindow.close();
                    mainWindow.webContents.send("microsoft-login-success", { authCode });
                    // ✅ Obtener el tema guardado y redirigir
                    const theme = store.get("selectedTheme") ?? "Default";
                    mainWindow.loadFile(path_1.default.join(__dirname, `../renderer/${theme}-home.html`));
                }
            });
            authWindow.on("closed", () => {
                authWindow.destroy();
            });
        }
        catch (error) {
            console.error("❌ Error en la autenticación de Microsoft:", error);
        }
    });
}
/**
 * 📌 Extrae el código de autenticación de la URL.
 */
function extractAuthCode(url) {
    try {
        const urlObj = new url_1.URL(url);
        return urlObj.searchParams.get("code") ?? null;
    }
    catch (error) {
        console.error("❌ Error al procesar la URL de autenticación:", error);
        return null;
    }
}
