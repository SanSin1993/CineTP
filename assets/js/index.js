// Este código se ejecuta cuando se carga completamente el contenido de la página.
document.addEventListener("DOMContentLoaded", async function () {
  // Si existe un elemento con el ID "logo", se agrega un evento de clic para redirigir a la página de inicio.
  if (logo) {
    logo.addEventListener("click", () => {
      window.location.href = "../index.html";
    });
  }

  // Definición de claves de API para acceder a datos de películas.
  const apiKeyEstrenos = '7f194cf23e4e2305fe113aa39e25592f';
  const apiKeyProximosEstrenos = '7f194cf23e4e2305fe113aa39e25592f';

  // Obtener la fecha actual en formato ISO.
  const currentDate = new Date().toISOString().split('T')[0];

  // Máximo número de elementos a mostrar en las secciones de películas.
  const maxElementsEstrenos = 4;
  const maxElementsProximosEstrenos = 3;

  // Función asincrónica para obtener datos de películas.
  async function fetchData(apiKey, pageRange, filterCriteria, maxElements, dataHandler) {
    const results = [];
    let page = pageRange[0];

    while (page <= pageRange[1] && results.length < maxElements) {
      // Construir la URL de la API para obtener datos de películas.
      const apiUrl = `https://api.themoviedb.org/3/discover/movie?page=${page}&api_key=${apiKey}&language=es-US`;

      try {
        // Realizar una solicitud a la API.
        const response = await fetch(apiUrl);

        if (response.ok) {
          // Obtener los datos de la respuesta en formato JSON.
          const data = await response.json();

          // Filtrar los datos según el criterio definido.
          const filteredData = data.results.filter(filterCriteria);

          // Agregar películas a la lista de resultados.
          for (const movie of filteredData) {
            if (results.length < maxElements) {
              results.push(movie);
            } else {
              break;
            }
          }

          page++;
        } else {
          console.error(`Error al obtener datos para la página ${page}: ${response.status}`);
        }
      } catch (error) {
        console.error(`Error al obtener datos para la página ${page}: ${error.message}`);
      }
    }

    // Procesar los resultados utilizando la función dataHandler.
    dataHandler(results);
  }

  // Función para mostrar imágenes en un carrusel.
  function displayImagesInCarousel(estrenos) {
    const carouselItems = document.querySelectorAll("#carouselExampleAutoplaying .carousel-item img");

    for (let i = 0; i < estrenos.length; i++) {
      if (i < carouselItems.length) {
        // Establecer la imagen y el título de la película en el carrusel.
        carouselItems[i].src = `https://image.tmdb.org/t/p/w500${estrenos[i].backdrop_path}`;
        carouselItems[i].alt = estrenos[i].title;

        // Agregar el título como un elemento <p> debajo de la imagen.
        const titleElement = document.createElement('p');
        titleElement.textContent = estrenos[i].title;
        carouselItems[i].parentElement.appendChild(titleElement);
      }
    }
  }

  // Función para crear elementos de película y mostrar información de estreno al hacer clic.
  function createMovieElement(movie, category) {
    const { title, poster_path, overview, release_date } = movie;

    if (poster_path === null) {
      // Saltar elementos sin poster.
      return;
    }

    // Ruta de la imagen de la película.
    const IMG_PATH = "https://image.tmdb.org/t/p/w1280";

    // Crear un contenedor para la película.
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("pelicula");
    movieContainer.innerHTML = `
      <img src="${IMG_PATH + poster_path}" alt="${title}">
      <div class="peliculaInfo">
          <h3>${title}</h3>
      </div>
    `;

    // Agregar el contenedor al elemento con el ID correspondiente.
    document.querySelector(`#${category}`).appendChild(movieContainer);

    // Agregar un evento de clic para mostrar la fecha de estreno.
    movieContainer.addEventListener("click", () => {
      // Obtener y formatear la fecha de estreno.
      const formattedReleaseDate = formatDate(release_date);

      // Utilizar SweetAlert para mostrar la fecha de estreno.
      Swal.fire({
        title: `${title} - Fecha de Estreno`,
        text: `La película se estrena el ${formattedReleaseDate}`,
        icon: "info",
      });
    });

    // Función para formatear la fecha a "DD-MM-AA".
    function formatDate(date) {
      const options = { day: "2-digit", month: "2-digit", year: "numeric" };
      return new Date(date).toLocaleDateString("es-ES", options);
    }
  }

  // Obtener datos de películas de estreno que cumplen ciertos criterios y mostrar imágenes en un carrusel.
  fetchData(apiKeyEstrenos, [1, 10], (movie) => (
    movie.original_language === "en" &&
    movie.release_date <= currentDate &&
    movie.release_date >= '2023-09-01' &&
    movie.vote_average > 7
  ), maxElementsEstrenos, displayImagesInCarousel);

  // Obtener datos de próximos estrenos que cumplen ciertos criterios y crear elementos de película.
  fetchData(apiKeyProximosEstrenos, [100, 150], (movie) => (
    movie.original_language === "en" &&
    movie.release_date >= currentDate &&
    movie.release_date <= '2023-12-31' &&
    movie.poster_path !== 'null' 
  ), maxElementsProximosEstrenos, (results) => {
    for (const movie of results) {
      createMovieElement(movie, "proximosEstrenos");
    }
  });
});
