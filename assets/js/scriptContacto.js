var logo = document.getElementById("logo")

logo.addEventListener("click", () =>{
    window.location.href = "../index.html";
} )


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

// Controlador de evento para el botón "Enviar"
submitBtn.addEventListener("click", function(event){
  event.preventDefault(); // Evita el envío automático del formulario

  // Validación de campos obligatorios
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var genres = document.getElementsByName("generos[]");
  var genresSelected = false;

  if (name == "" || email == "") {
    alert("Por favor, complete todos los campos obligatorios.");
    return false;
  }

  for (var i = 0; i < genres.length; i++) {
    if (genres[i].checked) {
      genresSelected = true;
      break;
    }
  }

  if (!genresSelected) {
    alert("Por favor, seleccione al menos un género de cine favorito.");
    return false;
  }

  
    // Alerta al presionar el botón "Suscribirse"
    if (confirm("¿Estás seguro de que deseas suscribirte a nuestra newsletter?")) {
      // Si el usuario hace clic en "Aceptar", se envía el formulario
      document.getElementById("signup-form").submit();
      alert("¡Gracias por suscribirte a nuestra newsletter!");
      window.location.href = "contacto.html";
    } else {
      // Si el usuario hace clic en "Cancelar", no se envía el formulario
      return false;
    }
});
// Controlador de evento para el botón "Atrás"
backBtn.addEventListener('click', function() {
    // Ir al paso anterior solo si no es el primer paso
    if (currentStep > 0) {
    // Ocultar el paso actual
    steps[currentStep].style.display = 'none';
    // Mostrar el paso anterior
    currentStep--;
    steps[currentStep].style.display = 'block';
    }
    });
    
    // Controlador de evento para el botón "Enviar"
    submitBtn.addEventListener('click', function() {
    // Validar los campos del formulario antes de enviar
    if (nameInput.value === '' || emailInput.value === '') {
    alert('Por favor, complete todos los campos obligatorios.');
    return;
    }
    var generosSelected = false;
    for (var i = 0; i < generosInputs.length; i++) {
    if (generosInputs[i].checked) {
    generosSelected = true;
    break;
    }
    }
    if (!generosSelected) {
    alert('Por favor, seleccione al menos un género de cine favorito.');
    return;
    }
    
    // Mostrar la sección de revisión
    steps[currentStep].style.display = 'none';
    currentStep++;
    steps[currentStep].style.display = 'block';
    updateReview();
    });
    
    // Función para actualizar la sección de revisión
    function updateReview() {
    reviewName.textContent = nameInput.value;
    reviewEmail.textContent = emailInput.value;
    
    reviewGeneros.innerHTML = '';
    for (var i = 0; i < generosInputs.length; i++) {
    if (generosInputs[i].checked) {
    var li = document.createElement('li');
    li.textContent = generosInputs[i].checked ? generosInputs[i].value : '';
    reviewGeneros.appendChild(li);
    }
    }
    }
    
    // Mostrar el primer paso al cargar la página
    showStep(0);