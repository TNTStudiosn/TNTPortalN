const { ipcRenderer } = require('electron');

document.addEventListener("DOMContentLoaded", () => {
    const continueBtn = document.getElementById("continue-btn");
    
    continueBtn.addEventListener("click", () => {
        ipcRenderer.send("set-fristrun");
        window.location.href = "main.html"; 
    });
});
