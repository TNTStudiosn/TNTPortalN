document.addEventListener("DOMContentLoaded", () => {
    const logo = document.getElementById("logo");
    
    setTimeout(() => {
        logo.style.opacity = "1";
        logo.style.transform = "scale(1)";
    }, 500);

    setTimeout(() => {
        window.location.href = "main.html"; // Cambiar a la pantalla principal del launcher
    }, 3000);
});
