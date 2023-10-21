document.addEventListener("DOMContentLoaded", function() {
  // Obtener elementos del DOM
  var logo = document.querySelector(".logo");
  var logoByID = document.getElementById("logo");
  var currentStep = 0;
  var steps = document.querySelectorAll('.step');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var submitBtn = document.getElementById('submitBtn');
  var nameInput = document.getElementById('name');
  var emailInput = document.getElementById('email');
  var generosInputs = document.querySelectorAll('input[name="generos[]"]');
  var reviewName = document.getElementById('review-name');
  var reviewEmail = document.getElementById('review-email');
  var reviewGeneros = document.getElementById('review-generos');
  var backBtn = document.getElementById('backBtn');


  if (logo) {
      logo.addEventListener("click", () => {
          window.location.href = "../index.html";
      });
  }

  // Función para mostrar el paso actual
  function showStep(n) {
    steps[currentStep].style.display = 'none';
    currentStep += n;
    steps[currentStep].style.display = 'block';

    if (currentStep === 0) {
      prevBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'inline';
    }

    if (currentStep === steps.length - 1) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'inline';
      updateReview();
    } else {
      nextBtn.style.display = 'inline';
      submitBtn.style.display = 'none';
    }
  }

  // Función para actualizar la sección de revisión
  function updateReview() {
    reviewName.textContent = nameInput.value;
    reviewEmail.textContent = emailInput.value;

    reviewGeneros.innerHTML = '';
    for (var i = 0; i < generosInputs.length; i++) {
      if (generosInputs[i].checked) {
        var li = document.createElement('li');
        li.textContent = generosInputs[i].value;
        reviewGeneros.appendChild(li);
      }
    }
  }

  // Controladores de eventos para los botones "Anterior" y "Siguiente"
  prevBtn.addEventListener('click', function() {
    showStep(-1);
  });

  nextBtn.addEventListener('click', function() {
    showStep(1);
  });

  backBtn.addEventListener('click', function() {
    if (currentStep > 0) {
      steps[currentStep].style.display = 'none';
      currentStep--;
      steps[currentStep].style.display = 'block';
    }
  });

  // Controlador de evento para el botón "Enviar"
  submitBtn.addEventListener('click', function(event) {
    event.preventDefault();

    var name = nameInput.value;
    var email = emailInput.value;
    var genresSelected = false;

    if (name === '' || email === '') {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    for (var i = 0; i < generosInputs.length; i++) {
      if (generosInputs[i].checked) {
        genresSelected = true;
        break;
      }
    }

    if (!genresSelected) {
      alert('Por favor, seleccione al menos un género de cine favorito.');
      return;
    }

    if (confirm('¿Estás seguro de que deseas suscribirte a nuestra newsletter?')) {
      document.getElementById('signup-form').submit();
      alert('¡Gracias por suscribirte a nuestra newsletter!');
      window.location.href = 'contacto.html';
    } else {
      return false;
    }
  });

  // Mostrar el primer paso al cargar la página
  showStep(0);
});



