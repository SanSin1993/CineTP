document.addEventListener("DOMContentLoaded", async function () {
  // Obtén el elemento del logo
  const logo = document.querySelector(".imgLogo");
  if (logo) {
    logo.addEventListener("click", () => {
      window.location.href = "./index.html";
    });
  }

  // Elemento principal donde se mostrarán las películas en el carrusel
  const carouselElement = document.querySelector("#carouselImgSection .carousel-inner");

  // Importa scriptCartelera.js para acceder a filteredMovieData
  import('./scriptCartelera.js')
    .then((module) => {
      // Accede a filteredMovieData después de que scriptCartelera.js se haya cargado
      const selectedMovies = module.filteredMovieData.slice(0, 6);

      // Resto del código para crear elementos de película y agregar al carrusel
      selectedMovies.forEach((movie, index) => {
        const { backdrop_path, title } = movie;
        const IMG_PATH = "https://image.tmdb.org/t/p/original";

        const carouselItem = document.createElement("div");
        carouselItem.classList.add("carousel-item");

        if (index === 0) {
          carouselItem.classList.add("active");
        }

        // Crear la imagen y establecer su fuente y atributos
        const img = document.createElement("img");
        img.src = IMG_PATH + backdrop_path;
        img.classList.add("d-block", "w-100");
        img.alt = title;

        // Agregar la imagen al elemento del carrusel
        carouselItem.appendChild(img);

        // Agregar el elemento del carrusel al carrusel principal
        carouselElement.appendChild(carouselItem);
      });
    })
    .catch((error) => {
      console.error("Error al importar scriptCartelera.js:", error);
    });













// Clave de API de TMDb
const apiKey = "7f194cf23e4e2305fe113aa39e25592f";

// Elemento principal donde se mostrarán las películas
const proximosEstrenos = document.querySelector("#proximosEstrenos");

// Obtener los datos de películas almacenados en el localStorage
const localStorageData = JSON.parse(localStorage.getItem("peliculas")) || {
  cartelera: [],
  proximosEstrenos: [],
};

// Lista de IDs de películas seleccionadas para próximos estrenos (solo 4 películas)
const selectedProximosEstrenosIDs = [554600, 615656, 980489, 385687];

// Cargar las películas seleccionadas en próximos estrenos
loadSelectedMovies(selectedProximosEstrenosIDs, "proximosEstrenos");

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
  const language = "es-ES";

  try {
    const response = await fetch(`${apiUrl}?api_key=${apiKey}&language=${language}`);
    if (response.ok) {
      const movieData = await response.json();
      return movieData;
    } else {
      console.error("Error al obtener datos de la película", movieID);
      return null;
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
    return null;
  }
}

// Función para crear elementos HTML para mostrar información de la película
function createMovieElement(movie, category) {
  const { title, poster_path, overview } = movie;
  const IMG_PATH = "https://image.tmdb.org/t/p/w1280";

  const peliculaElegida = document.createElement("div");
  peliculaElegida.classList.add("pelicula");
  peliculaElegida.innerHTML = `
    <img src="${IMG_PATH + poster_path}" alt="${title}">
    <div class="peliculaInfo">
        <h3>${title}</h3>
    </div>
    <div class="overview">
        <h4>Descripción</h4>
        ${overview}
        <br></br>
    </div>
  `;

  proximosEstrenos.appendChild(peliculaElegida);
}



















});
