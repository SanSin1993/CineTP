document.addEventListener("DOMContentLoaded", function () {
  
  // Obtener elementos del DOM
  const submitBtn = document.getElementById('submitBtn');
  const submitConsultas = document.getElementById('submitConsultas');
  const steps = document.querySelectorAll('.step');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentStep = 0;

  // Función para avanzar o retroceder en los pasos
  function nextPrev(n) {
    steps[currentStep].style.display = 'none';
    currentStep += n;
    steps[currentStep].style.display = 'block';

    // Mostrar u ocultar los botones de "Anterior" y "Siguiente" según el paso actual
    if (currentStep === 0) {
      prevBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'inline';
    }

    if (currentStep === steps.length - 1) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'inline';
    } else {
      nextBtn.style.display = 'inline';
      submitBtn.style.display = 'none';
    }
  }

  // Controlador de evento para el botón "Enviar Consultas"
  submitConsultas.addEventListener('click', (event) => {
    event.preventDefault();
    Swal.fire({
      icon: 'success',
      title: 'Gracias por comunicarte con CineTP',
      text: 'Hemos recibido tus consultas y sugerencias.',
    });
  });

  // Controlador de evento para el botón "Enviar"
  submitBtn.addEventListener('click', (event) => {
    event.preventDefault();
    Swal.fire({
      icon: 'success',
      title: 'Gracias por suscribirte a nuestro boletín de noticias',
      text: 'Ahora recibirás nuestras últimas novedades del mundo del cine en tu correo.',
    }).then(() => {
      document.getElementById('signup-form').submit();
      window.location.href = 'contacto.html';
    });
  });

  // Controladores de evento para los botones "Anterior" y "Siguiente"
  prevBtn.addEventListener('click', () => nextPrev(-1));
  nextBtn.addEventListener('click', () => nextPrev(1));

  // Iniciar mostrando el primer paso
  nextPrev(0);
});

