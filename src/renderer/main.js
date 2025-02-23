document.addEventListener("DOMContentLoaded", () => {
    if (!window.electron) {
        console.error("Error: window.electron no está definido. Revisa preload.js.");
        return;
    }

    document.getElementById("minimize").addEventListener("click", () => {
        window.electron.minimize();
    });

    document.getElementById("maximize").addEventListener("click", () => {
        window.electron.maximize();
    });

    document.getElementById("close").addEventListener("click", () => {
        window.electron.close();
    });
});
