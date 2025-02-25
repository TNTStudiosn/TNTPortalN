"use strict";
// src/main/auth.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMicrosoftAuth = handleMicrosoftAuth;
const electron_1 = require("electron");
const axios_1 = __importDefault(require("axios"));
const MICROSOFT_AUTH_URL = "https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize";
const MICROSOFT_TOKEN_URL = "https://login.microsoftonline.com/consumers/oauth2/v2.0/token";
// If you want to support organizational accounts too, consider "common" instead of "consumers".
// You can store this in your .env or a config file
const AZURE_CLIENT_ID = process.env.AZURE_CLIENT_ID || "7b62a47b-a95a-450d-ba0f-c4d8d0cac62b";
const REDIRECT_URI = "https://login.microsoftonline.com/common/oauth2/nativeclient";
// In many cases, "https://login.microsoftonline.com/common/oauth2/nativeclient" is allowed by default for MS logins.
function handleMicrosoftAuth(mainWindow) {
    electron_1.ipcMain.on("start-microsoft-login", async (event) => {
        // 1) Create a small BrowserWindow for Microsoft OAuth
        const authWindow = new electron_1.BrowserWindow({
            width: 600,
            height: 700,
            show: true,
            parent: mainWindow ?? undefined,
            modal: false,
            frame: false,
            webPreferences: {
                nodeIntegration: false
            }
        });
        // 2) Build the OAuth2 URL
        const params = new URLSearchParams({
            client_id: AZURE_CLIENT_ID,
            response_type: "code",
            redirect_uri: REDIRECT_URI,
            scope: "XboxLive.signin offline_access",
            // ^ You can adjust the scopes for your application’s needs.
            prompt: "select_account"
        });
        const loginUrl = `${MICROSOFT_AUTH_URL}?${params.toString()}`;
        authWindow.loadURL(loginUrl);
        // 3) Watch for navigation events to detect the redirect
        authWindow.webContents.on("did-navigate", async (_ev, newUrl) => {
            // If the URL starts with our REDIRECT_URI, we have either a code or an error
            if (newUrl.startsWith(REDIRECT_URI)) {
                try {
                    // Close the popup immediately
                    authWindow.close();
                    // Extract the code from the callback URL
                    const urlObj = new URL(newUrl);
                    const authCode = urlObj.searchParams.get("code");
                    if (!authCode) {
                        // If there's no code, it may be an error scenario
                        event.sender.send("microsoft-login-success", {
                            error: "No code received from Microsoft."
                        });
                        return;
                    }
                    // 4) Exchange the code for an access token + refresh token
                    const tokenData = await exchangeCodeForTokens(authCode);
                    // 5) Optionally: retrieve some profile data from MS, or store the tokens
                    // For simplicity, we'll just pass them back to the renderer
                    event.sender.send("microsoft-login-success", {
                        tokens: tokenData
                    });
                }
                catch (err) {
                    event.sender.send("microsoft-login-success", {
                        error: `Error during Microsoft Auth: ${String(err)}`
                    });
                }
            }
        });
        authWindow.on("closed", () => {
            // If user closes before signing in, we can notify renderer if needed
        });
    });
}
/**
 * Helper function to exchange the authorization code for tokens via MS OAuth2.
 * This uses axios to POST to the Microsoft token endpoint.
 */
async function exchangeCodeForTokens(authCode) {
    const data = new URLSearchParams({
        client_id: AZURE_CLIENT_ID,
        code: authCode,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code"
    });
    // If you need a client_secret, add it here:
    // data.append("client_secret", process.env.AZURE_CLIENT_SECRET!)
    const resp = await axios_1.default.post(MICROSOFT_TOKEN_URL, data.toString(), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
    return resp.data;
}
