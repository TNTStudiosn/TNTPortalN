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
        // Guardar el tema seleccionado antes de iniciar sesión
        window.electron.setTheme(selectedTheme);

        // 🔥 Redirigir primero a la página de inicio de sesión con Microsoft
        window.electron.navigate("Microsoft.html");
    });
});
