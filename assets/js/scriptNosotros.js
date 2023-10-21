document.addEventListener("DOMContentLoaded", function() {
    // Obtener elementos del DOM
    var logo = document.querySelector(".logo");
  
    if (logo) {
        logo.addEventListener("click", () => {
            window.location.href = "../index.html";
        });
    }
  });