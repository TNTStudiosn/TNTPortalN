document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-btn");

    loginBtn.addEventListener("click", () => {
        window.electron.startMicrosoftLogin();
    });

    // ✅ Escuchar el evento cuando la autenticación es exitosa
    window.electron.onMicrosoftLoginSuccess((userData) => {
        console.log("Usuario autenticado:", userData);

        // Guardar el usuario en localStorage
        localStorage.setItem("microsoftUser", JSON.stringify(userData));

        // Obtener el tema guardado para cargar la pantalla correspondiente
        window.electron.getConfig().then((config) => {
            const themePage = `${config.theme}-home.html`;
            window.electron.navigate(themePage);
        });
    });
});
