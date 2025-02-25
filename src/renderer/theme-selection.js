const { ipcRenderer } = require("electron");

// Lista de temas disponibles (se pueden agregar más)
const themes = [
    { id: "default", name: "Predeterminado" },
    { id: "dark", name: "Modo Oscuro" },
    { id: "light", name: "Modo Claro" },
    { id: "cyberpunk", name: "Cyberpunk" }
];

document.addEventListener("DOMContentLoaded", () => {
    const themesContainer = document.getElementById("themes-container");
    let selectedTheme = "default"; // Tema predeterminado

    // Generar opciones de tema dinámicamente
    themes.forEach(theme => {
        const themeCard = document.createElement("div");
        themeCard.classList.add("theme-card");
        themeCard.dataset.theme = theme.id;
        themeCard.innerText = theme.name;

        if (theme.id === selectedTheme) {
            themeCard.classList.add("selected");
        }

        themeCard.addEventListener("click", () => {
            document.querySelectorAll(".theme-card").forEach(card => card.classList.remove("selected"));
            themeCard.classList.add("selected");
            selectedTheme = theme.id;
        });

        themesContainer.appendChild(themeCard);
    });

    // Aplicar el tema seleccionado
    document.getElementById("apply-theme-btn").addEventListener("click", () => {
        ipcRenderer.send("set-theme", selectedTheme);
        window.location.href = "Default-home"; // Redirigir a la pantalla principal
    });
});
