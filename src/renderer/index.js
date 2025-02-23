// index.js
document.addEventListener("DOMContentLoaded", () => {
    const logo = document.getElementById("logo");
  
    logo.addEventListener("animationend", (event) => {
      if (event.animationName === "logoAnimation") {
        // Retraso de 2 segundos para que el logo se mantenga visible antes de redirigir
        setTimeout(() => {
          window.location.href = "main.html"; // Redirige a la siguiente página
        }, 3000);
      }
    });
  });
  