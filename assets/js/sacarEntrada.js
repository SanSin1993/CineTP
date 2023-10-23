document.addEventListener("DOMContentLoaded", async function() {
    
    var logo = document.querySelector(".logo");
  
    if (logo) {
        logo.addEventListener("click", () => {
            window.location.href = "../index.html";
        });
    }



    const btnComprar = document.getElementById("btnComprar");
    const main = document.querySelector('.mainContainer');
    
    // Obtener la URL actual
    const url = window.location.href;
    
    // Crear un objeto URL para analizar la URL
    const urlObj = new URL(url);
    
    // Obtener el valor del parámetro "id"
    const movieID = urlObj.searchParams.get("id");
    
    // Comprobar si se ha encontrado el parámetro "id"
    if (!movieID) {
        console.log("El parámetro 'id' no se encontró en la URL.");
        return;  // Termina la función si no se encuentra el parámetro 'id'
    }

    const apiKey = '7f194cf23e4e2305fe113aa39e25592f';

    // Obtener datos de la película desde la API
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

    // Llamada a la función para obtener datos de la película
    const movie = await getMovieDetails(movieID);

    if (!movie) {
        console.log("Error al obtener datos de la película.");
        return;
    }

    // Elementos de la película
    const { title, poster_path, overview } = movie;
    const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

    // Actualizar elementos en la página
    const imagenPelicula = document.getElementById("imgPelicula");
    const TitPelicula = document.getElementById("tituloPeli");
    const sinapsis = document.getElementById("sinapsis");

    imagenPelicula.src = IMG_PATH + poster_path;
    imagenPelicula.alt = title;
    TitPelicula.innerText = title;
    sinapsis.innerText = overview;

    const ds = document.getElementById("dias");
    const hs = document.getElementById("horarios");



// Selecciona el elemento h4 donde mostrar el precio de entrada
const precioEntrada = document.querySelector('#precioEntrada');

// Selecciona el input de cantidad de entradas
const cantEntradasInput = document.getElementById("cantEntradas");

// Agregar un evento de escucha para el input
cantEntradasInput.addEventListener("input", function() {
    const cantidadEntradas = parseInt(cantEntradasInput.value, 10);

    // Establece el precio base
    const precioBase = 3000;

    if (!isNaN(cantidadEntradas) && cantidadEntradas >= 1) {
        const precioTotal = cantidadEntradas * precioBase;
        precioEntrada.innerText = `Valor de la entrada: $${precioTotal}`;
    } else {
        // Restablece el texto cuando no es un número válido
        precioEntrada.innerText = 'Valor de la entrada $3000';
    }
});

    











// Calcular las fechas de los próximos 7 días de la semana (excluyendo el día actual)
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

// Generar días de la semana sin contar el día actual
const dates = generateDatesExcludingToday();

for (const date of dates) {
    const dayOfWeek = generateDayOfWeek(date);
    const formattedDate = formatDate(date);

    const diaElement = document.createElement('div');
    diaElement.classList.add('funcion');
    diaElement.classList.add('dia');
    diaElement.innerText = `${dayOfWeek} ${formattedDate}`;

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
function generateDayOfWeek(date) {
    const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return daysOfWeek[date.getDay()];
}

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
}


    
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

    btnComprar.addEventListener('click', () => pdfCompra());

    function pdfCompra() {
        const diaActivo = ds.querySelector('.dia.activo');
        const dia = diaActivo ? diaActivo.innerText : "Día no seleccionado";

        const horaActiva = hs.querySelector('.horario.activo');
        const horario = horaActiva ? horaActiva.innerText : "Horario no seleccionado";

        const doc = new jsPDF();
        doc.text(`Cine TP

        Compra realizada para la función de ${title} en el ${dia} 
        en hora ${horario}.

        Gracias por su compra. ¡Lo esperamos!`
            , 10, 10);

        const pdfContent = doc.output('datauristring');
        const iframe = `<iframe width='100%' height='100%' src='${pdfContent}'></iframe>`;
        const newWindow = window.open();
        newWindow.document.open();
        newWindow.document.write(iframe);
        newWindow.document.close();
    }
});
