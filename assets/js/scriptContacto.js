document.addEventListener("DOMContentLoaded", function() {
  // Obtener elementos del DOM
  const logo = document.querySelector(".logo");
  const steps = document.querySelectorAll('.step');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const generosInputs = document.querySelectorAll('input[name="generos[]"]');
  const reviewName = document.getElementById('review-name');
  const reviewEmail = document.getElementById('review-email');
  const reviewGeneros = document.getElementById('review-generos');
  const backBtn = document.getElementById('backBtn');
  const submitConsultas = document.getElementById('submitConsultas');

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

    prevBtn.style.display = currentStep === 0 ? 'none' : 'inline';
    nextBtn.style.display = currentStep === steps.length - 1 ? 'none' : 'inline';
    submitBtn.style.display = currentStep === steps.length - 1 ? 'inline' : 'none';

    if (currentStep === steps.length - 1) {
      updateReview();
    }
  }

  let currentStep = 0;
  showStep(0);

  // Función para actualizar la sección de revisión
  function updateReview() {
    reviewName.textContent = nameInput.value;
    reviewEmail.textContent = emailInput.value;

    reviewGeneros.innerHTML = '';
    generosInputs.forEach(input => {
      if (input.checked) {
        const li = document.createElement('li');
        li.textContent = input.value;
        reviewGeneros.appendChild(li);
      }
    });
  }

  // Controladores de eventos para los botones "Anterior" y "Siguiente"
  prevBtn.addEventListener('click', () => showStep(-1));
  nextBtn.addEventListener('click', () => showStep(1));

  backBtn.addEventListener('click', () => {
    if (currentStep > 0) {
      steps[currentStep].style.display = 'none';
      currentStep--;
      steps[currentStep].style.display = 'block';
    }
  });

  // Controlador de evento para el botón "Enviar Consultas"
  submitConsultas.addEventListener('click', (event) => {
    event.preventDefault();
    Swal.fire('Gracias por comunicarte con CineTP');
  });

  // Controlador de evento para el botón "Enviar"
  submitBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const name = nameInput.value;
    const email = emailInput.value;
    const genresSelected = generosInputs.some(input => input.checked);

    if (name === '' || email === '') {
      Swal.fire({
        icon: 'error',
        title: 'Campos Obligatorios',
        text: 'Por favor, complete todos los campos obligatorios.'
      });
      return;
    }

    if (!genresSelected) {
      Swal.fire({
        icon: 'error',
        title: 'Seleccione Géneros',
        text: 'Por favor, seleccione al menos un género de cine favorito.'
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Suscripción Exitosa',
      text: 'Gracias por suscribirte a nuestro boletín de noticias'
    }).then(() => {
      document.getElementById('signup-form').submit();
      window.location.href = 'contacto.html';
    });
  });
});
