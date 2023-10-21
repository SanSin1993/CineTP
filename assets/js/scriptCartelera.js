document.addEventListener("DOMContentLoaded", function() {
  var logo = document.querySelector(".imgLogo");
  if (logo) {
      logo.addEventListener("click", () => {
          window.location.href = "../index.html";
      });
  }


// Obtener el elemento del logotipo y agregar un evento de clic para redirigir a la página de inicio.
var logo = document.getElementById("logo");
logo.addEventListener("click", () => {
  window.location.href = "../index.html";
});

// Clave de API de TMDb
const apiKey = '7f194cf23e4e2305fe113aa39e25592f';

// Elemento principal donde se mostrarán las películas
const main = document.querySelector('.main');

// Obtener los datos de películas almacenados en el localStorage
const localStorageData = JSON.parse(localStorage.getItem('peliculas')) || { cartelera: [], proximosEstrenos: [] };

// Lista de IDs de películas seleccionadas para la cartelera (solo 8 películas)
const selectedCarteleraMovieIDs = [
  299054,
  575264,
  926393,
  968051,
  678512,
  1151534,
  1008042,
  565770,
  346698, 
  466420, 
  1032948, 
  1008042
];

// Cargar las películas seleccionadas en la cartelera
loadSelectedMovies(selectedCarteleraMovieIDs, 'cartelera');

// Función para cargar películas según su ID y categoría (cartelera o próximos estrenos)
async function loadSelectedMovies(movieIDs, category) {
  for (const movieID of movieIDs) {
    const movieData = await getMovieDetails(movieID);
    if (movieData) {
      createMovieElement(movieData, category);
    }
  }
}

// Función para obtener detalles de una película por su ID
async function getMovieDetails(movieID) {
  const apiUrl = `https://api.themoviedb.org/3/movie/${movieID}`;
  const language = 'es-ES';

  try {
    const response = await fetch(`${apiUrl}?api_key=${apiKey}&language=${language}`);
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

// Función para crear elementos HTML para mostrar información de la película
function createMovieElement(movie, category) {
  const { title, poster_path, overview } = movie;
  const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

  const peliculaElegida = document.createElement('div');
  peliculaElegida.classList.add('pelicula');
  peliculaElegida.innerHTML = `
    <img src="${IMG_PATH + poster_path}" alt="${title}">
    <div class="peliculaInfo">
        <h3>${title}</h3>
    </div>
    <div class="overview">
        <h4>Overview</h4>
        ${overview}
        <br></br>
    </div>
  `;

  main.appendChild(peliculaElegida);

  // Almacenar la película en el localStorage correspondiente
  localStorageData[category].push(movie);
  localStorage.setItem('peliculas', JSON.stringify(localStorageData));

  peliculaElegida.addEventListener("click", () => {
    window.location.href = `./sacarEntrada.html?id=${movie.id}`;
  });
}

  
});

