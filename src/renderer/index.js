document.addEventListener("DOMContentLoaded", () => {
    const logo = document.getElementById("logo");

    logo.addEventListener("animationend", async (event) => {
        if (event.animationName === "logoAnimation") {
            setTimeout(async () => {
                const isFirstRun = await window.electron.checkFirstRun();
                if (isFirstRun) {
                    window.location.href = "welcome.html";
                } else {
                    window.location.href = "Default-home.html";
                }
            }, 800); // Espera 800ms antes de redirigir
        }
    });
});
