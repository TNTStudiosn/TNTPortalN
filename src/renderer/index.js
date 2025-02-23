// index.js
document.addEventListener("DOMContentLoaded", () => {
    const logo = document.getElementById("logo");
  
    logo.addEventListener("animationend", (event) => {
      if (event.animationName === "logoAnimation") {
        setTimeout(() => {
          window.location.href = "main.html"; 
        }, 800);
      }
    });
  });
  