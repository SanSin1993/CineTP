// Esperar a que el documento HTML esté completamente cargado
document.addEventListener("DOMContentLoaded", async function() {
    
    // Obtener el elemento del logo y agregar un evento de clic para redirigir al inicio
    var logo = document.querySelector(".logo");
    if (logo) {
        logo.addEventListener("click", () => {
            window.location.href = "../index.html";
        });
    }

    // Obtener el botón "Comprar" y el contenedor principal
    const btnComprar = document.getElementById("btnComprar");
    const main = document.querySelector('.mainContainer');
    
    // Obtener la URL actual
    const url = window.location.href;
    
    // Crear un objeto URL para analizar la URL
    const urlObj = new URL(url);
    
    // Obtener el valor del parámetro "id" de la URL
    const movieID = urlObj.searchParams.get("id");
    
    // Comprobar si se ha encontrado el parámetro "id"
    if (!movieID) {
        console.log("El parámetro 'id' no se encontró en la URL.");
        return;  // Termina la función si no se encuentra el parámetro 'id'
    }

    // Clave de API de The Movie Database
    const apiKey = '7f194cf23e4e2305fe113aa39e25592f';

    // Función para obtener detalles de la película desde la API
    async function getMovieDetails(movieID) {
        const apiUrl = `https://api.themoviedb.org/3/movie/${movieID}`;
        
        try {
            const response = await fetch(`${apiUrl}?api_key=${apiKey}&language=es-ES`);
            
            if (response.ok) {
                const movieData = await response.json();
                return movieData;
            } else {
                console.error('Error al obtener datos de la película', movieID);
                return null;
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            return null;
        }
    }

    // Llamar a la función para obtener datos de la película
    const movie = await getMovieDetails(movieID);

    if (!movie) {
        console.log("Error al obtener datos de la película.");
        return;
    }

    // Elementos de la película
    const { title, poster_path, overview } = movie;
    const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

    // Actualizar elementos en la página con los detalles de la película
    const imagenPelicula = document.getElementById("imgPelicula");
    const TitPelicula = document.getElementById("tituloPeli");
    const sinapsis = document.getElementById("sinapsis");

    imagenPelicula.src = IMG_PATH + poster_path;
    imagenPelicula.alt = title;
    TitPelicula.innerText = title;
    sinapsis.innerText = overview;

    // Elementos relacionados con la selección de entradas
    const ds = document.getElementById("dias");
    const hs = document.getElementById("horarios");

    // Seleccionar el elemento h4 donde se mostrará el precio de entrada
    const precioEntrada = document.querySelector('#precioEntrada');

    // Seleccionar el input de cantidad de entradas
    const cantEntradasInput = document.getElementById("cantEntradas");

    // Agregar un evento de escucha para el input de cantidad de entradas
    cantEntradasInput.addEventListener("input", function() {
        const cantidadEntradas = parseInt(cantEntradasInput.value, 10);

        // Establecer el precio base
        const precioBase = 3000;

        if (!isNaN(cantidadEntradas) && cantidadEntradas >= 1) {
            const precioTotal = cantidadEntradas * precioBase;
            precioEntrada.innerText = `Valor de la entrada: $${precioTotal}`;
        } else {
            // Restablecer el texto cuando no es un número válido
            precioEntrada.innerText = 'Valor de la entrada $3000';
        }
    });

    // Función para generar fechas de los próximos 7 días de la semana (excluyendo el día actual)
    function generateDatesExcludingToday() {
        const today = new Date();
        const nextSevenDays = [];

        for (let i = 1; i <= 7; i++) { // Comenzar desde 1 para excluir el día actual
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            nextSevenDays.push(date);
        }

        return nextSevenDays;
    }

    // Generar días de la semana sin contar el día actual y agregar eventos de clic
    const dates = generateDatesExcludingToday();
    for (const date of dates) {
        const dayOfWeek = generateDayOfWeek(date);
        const formattedDate = formatDate(date);

        const diaElement = document.createElement('div');
        diaElement.classList.add('funcion');
        diaElement.classList.add('dia');
        diaElement.innerHTML = `${dayOfWeek} <br> ${formattedDate}`;

        diaElement.addEventListener("click", () => {
            const diaActivo = ds.querySelector('.dia.activo');
            if (diaActivo) {
                diaActivo.classList.remove('activo');
            }

            diaElement.classList.add('activo');
            hs.innerHTML = '';
            cargarHorarios();
        });

        ds.appendChild(diaElement);
    }

    // Función para generar el día de la semana
    function generateDayOfWeek(date) {
        const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        return daysOfWeek[date.getDay()];
    }

    // Función para formatear la fecha
    function formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${day}/${month}`;
    }

    // Función para cargar los horarios y agregar eventos de clic
    function cargarHorarios() {
        const horarios = ["12:00Hs", "15:00Hs", "18:00Hs"];
        for (const horario of horarios) {
            const horaElement = document.createElement('div');
            horaElement.classList.add('funcion');
            horaElement.classList.add('horario');
            horaElement.innerText = horario;

            horaElement.addEventListener("click", () => {
                const horaActiva = hs.querySelector('.horario.activo');
                if (horaActiva) {
                    horaActiva.classList.remove('activo');
                }

                horaElement.classList.add('activo');
            });

            hs.appendChild(horaElement);
        }
    }

// Agregar un evento de clic al botón "Comprar" para generar y mostrar un PDF
btnComprar.addEventListener('click', () => {
    const diaActivo = ds.querySelector('.dia.activo');
    const horaActiva = hs.querySelector('.horario.activo');

    if (!diaActivo || !horaActiva) {
        alert("Por favor, elige un día y un horario de función antes de comprar.");
        return; // Detiene la función si no se ha elegido día y horario
    }

    pdfCompra();
});

    // Función para generar el PDF de la compra
    function pdfCompra() {
        const diaActivo = ds.querySelector('.dia.activo');
        const dia = diaActivo ? diaActivo.innerText : "Día no seleccionado";

        const horaActiva = hs.querySelector('.horario.activo');
        const horario = horaActiva ? horaActiva.innerText : "Horario no seleccionado";

        // Obtener la cantidad de entradas y el costo total
         const cantidadEntradas = parseInt(cantEntradasInput.value, 10);
          const precioBase = 3000;
          const precioTotal = isNaN(cantidadEntradas) || cantidadEntradas < 1 ? precioBase : cantidadEntradas * precioBase;
          // Función para eliminar tildes y caracteres especiales
            function eliminarTildes(texto) {
              return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            }

            // Llamamos a la función eliminarTildes para quitar las tildes de las variables
            const peliculaSinTildes = eliminarTildes(title);
            const diaSinTildes = eliminarTildes(dia);
            const horarioSinTildes = eliminarTildes(horario);

           // Crear un nuevo documento PDF
           const doc = new jsPDF();
          doc.text(
            `             ----------------------------------------
                CINE TP - RESERVA DE ENTRADA
             ----------------------------------------

             Película: ${peliculaSinTildes}
             Día: ${diaSinTildes}
             Horario: ${horarioSinTildes}

             ----------------------------------------
                DETALLES DE TU RESERVA
             ----------------------------------------

             Cantidad de Entradas: ${cantidadEntradas}
             Costo Total: $${precioTotal}

             ----------------------------------------
                ¡Gracias por elegir CINE TP!
             ----------------------------------------`
        
            , 10, 10);

        // Generar la URL de datos para el PDF
        const pdfContent = doc.output('datauristring');
        
        // Crear un iframe para mostrar el PDF
        const iframe = `<iframe width='100%' height='100%' src='${pdfContent}'></iframe>`;
        const newWindow = window.open();
        newWindow.document.open();
        newWindow.document.write(iframe);
        newWindow.document.close();
    }
});
