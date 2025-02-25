document.addEventListener("DOMContentLoaded", () => {
    const continueBtn = document.getElementById("continue-btn");
    
    continueBtn.addEventListener("click", () => {
        window.electron.setFirstRun();
        window.electron.navigate("theme-selection.html"); 
    });
});
