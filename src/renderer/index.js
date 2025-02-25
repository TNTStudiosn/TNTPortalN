document.addEventListener("DOMContentLoaded", async () => {
    const logo = document.getElementById("logo");

    logo.addEventListener("animationend", async (event) => {
        if (event.animationName === "logoAnimation") {
            setTimeout(async () => {
                const isFirstRun = await window.electron.checkFirstRun();
                if (isFirstRun) {
                    window.electron.navigate("welcome.html");
                } else {
                    // 🔥 Verificar el tema guardado en config.json
                    fetchConfig().then((theme) => {
                        const themePage = `${theme}-home.html`;
                        window.electron.navigate(themePage);
                    });
                }
            }, 800);
        }
    });
});

// 🔥 Función para obtener el tema guardado en config.json
async function fetchConfig() {
    try {
        const response = await window.electron.getConfig();
        return response.theme || "Default"; // Si no hay tema, usar Default
    } catch {
        return "Default";
    }
}
