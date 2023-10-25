document.addEventListener("DOMContentLoaded", async function () {

  if (logo) {
    logo.addEventListener("click", () => {
      window.location.href = "../index.html";
    });
  }

  const apiKey = '7f194cf23e4e2305fe113aa39e25592f';
  const baseUrl = 'https://api.themoviedb.org/3/discover/movie';
  const estrenos = [];
  const proximosEstrenos = []
  const startPage = 1;
  const endPage = 100;
  const currentDate = new Date().toISOString().split('T')[0];
  const maxElements = 4;

  async function fetchDataForPages() {
    let page = 1;
    let totalElementsAdded = 0;

    while (page <= 10 && totalElementsAdded < maxElements) {
      const apiUrl = `https://api.themoviedb.org/3/discover/movie?page=${page}&api_key=${apiKey}&language=es-ES`;

      try {
        const response = await fetch(apiUrl);

        if (response.ok) {
          const data = await response.json();

          const filteredDataEstrenos = data.results.filter(movie => (
            movie.original_language === "en" &&
            movie.release_date <= currentDate &&
            movie.release_date >= '2023-09-01' &&
            movie.vote_average > 8
          ));

          if (filteredDataEstrenos.length > 0) {
            const elementsToAdd = Math.min(filteredDataEstrenos.length, maxElements - totalElementsAdded);
            const moviesToAdd = filteredDataEstrenos.slice(0, elementsToAdd);
            estrenos.push(...moviesToAdd);
            totalElementsAdded += elementsToAdd;
          }

          page++;
        } else {
          console.error(`Error fetching data for page ${page}: ${response.status}`);
        }
      } catch (error) {
        console.error(`Error fetching data for page ${page}: ${error.message}`);
      }
    }

    displayImagesInCarousel();
  }

  function displayImagesInCarousel() {
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

  fetchDataForPages();
});
