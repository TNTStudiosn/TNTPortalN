document.addEventListener("DOMContentLoaded", () => {
    const themesContainer = document.getElementById("themes-container");
    let selectedTheme = "Default"; // Tema predeterminado

    const themes = [
        { id: "Default", name: "Predeterminado" } // Se pueden agregar más temas aquí
    ];

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
        const selectedPage = `${selectedTheme}-home.html`; // Genera la página correspondiente
        window.electron.setTheme(selectedTheme);
        window.electron.navigate(selectedPage); // 🔥 Redirigir a la página del tema seleccionado
    });
});
