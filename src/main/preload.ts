import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("api", {
  sendMessage: (message: string) => console.log(message),
});
