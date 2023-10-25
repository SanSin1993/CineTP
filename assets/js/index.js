document.addEventListener("DOMContentLoaded", async function () {

  if (logo) {
    logo.addEventListener("click", () => {
        window.location.href = "../index.html";
    });
}

  const apiKeyEstrenos = '7f194cf23e4e2305fe113aa39e25592f';
  const apiKeyProximosEstrenos = '7f194cf23e4e2305fe113aa39e25592f';

  const currentDate = new Date().toISOString().split('T')[0];
  const maxElementsEstrenos = 4;
  const maxElementsProximosEstrenos =5;

  async function fetchData(apiKey, pageRange, filterCriteria, maxElements, dataHandler) {
    const results = [];
    let page = pageRange[0];

    while (page <= pageRange[1] && results.length < maxElements) {
      const apiUrl = `https://api.themoviedb.org/3/discover/movie?page=${page}&api_key=${apiKey}&language=es-US`;

      try {
        const response = await fetch(apiUrl);

        if (response.ok) {
          const data = await response.json();

          const filteredData = data.results.filter(filterCriteria);

          for (const movie of filteredData) {
            if (results.length < maxElements) {
              results.push(movie);
            } else {
              break;
            }
          }

          page++;
        } else {
          console.error(`Error fetching data for page ${page}: ${response.status}`);
        }
      } catch (error) {
        console.error(`Error fetching data for page ${page}: ${error.message}`);
      }
    }

    dataHandler(results);
  }

  function displayImagesInCarousel(estrenos) {
    const carouselItems = document.querySelectorAll("#carouselExampleAutoplaying .carousel-item img");

    for (let i = 0; i < estrenos.length; i++) {
      if (i < carouselItems.length) {
        carouselItems[i].src = `https://image.tmdb.org/t/p/w500${estrenos[i].backdrop_path}`;
        carouselItems[i].alt = estrenos[i].title;

        // Agregar el título como un elemento <p> debajo de la imagen
        const titleElement = document.createElement('p');
        titleElement.textContent = estrenos[i].title;
        carouselItems[i].parentElement.appendChild(titleElement);
      }
    }
  }

  function createMovieElement(movie, category) {
    const { title, poster_path, overview, release_date } = movie;
  
    if (poster_path === null) {
      // Si poster_path es null, salta este elemento
      return;
    }
  
    const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
  
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("pelicula");
    movieContainer.innerHTML = `
      <img src="${IMG_PATH + poster_path}" alt="${title}">
      <div class="peliculaInfo">
          <h3>${title}</h3>
      </div>
    `;
  
    document.querySelector(`#${category}`).appendChild(movieContainer);
  
// Agregar un evento click para mostrar la fecha de estreno
movieContainer.addEventListener("click", () => {
  // Obtener la fecha en formato "DD-MM-AA"
  const formattedReleaseDate = formatDate(release_date);

  // Utilizar SweetAlert para mostrar la fecha de estreno
  Swal.fire({
    title: `${title} - Fecha de Estreno`,
    text: `La película se estrena el ${formattedReleaseDate}`,
    icon: "info",
  });
});

// Función para formatear la fecha a "DD-MM-AA"
function formatDate(date) {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(date).toLocaleDateString("es-ES", options);
}

  }
  

  fetchData(apiKeyEstrenos, [1, 10], (movie) => (
    movie.original_language === "en" &&
    movie.release_date <= currentDate &&
    movie.release_date >= '2023-09-01' &&
    movie.vote_average > 7
  ), maxElementsEstrenos, displayImagesInCarousel);

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