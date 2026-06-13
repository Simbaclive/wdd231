document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
});

function initNavigation() {
    const toggleButton = document.getElementById("menu-toggle");
    const navList = document.querySelector("nav ul");

    if (toggleButton && navList) {
        toggleButton.addEventListener("click", () => {
            navList.classList.toggle("open");
        });
    }
}