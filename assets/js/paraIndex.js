document.addEventListener("DOMContentLoaded", async function () {
  if (logo) {
    logo.addEventListener("click", () => {
        window.location.href = "../index.html";
    });
  }

  const apiKey = '7f194cf23e4e2305fe113aa39e25592f';
  const currentDate = new Date().toISOString().split('T')[0];
  const maxElements = 4;

  async function fetchDataForPages() {
    const proximosEstrenos = new Set(); // Usamos un conjunto para evitar duplicados
    let page = 100;
    const endPage = 150;
    let totalElementsAdded = 0;

    while (page <= endPage && totalElementsAdded < maxElements) {
      const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=release_date.desc&page=${page}`;

      try {
        const response = await fetch(apiUrl);

        if (response.ok) {
          const data = await response.json();

          const filteredDataProximosEstrenos = data.results.filter(movie => (
            movie.original_language === "en" &&
            movie.release_date <= currentDate && // Comparar con la fecha actual
            movie.release_date <= '2023-12-31' &&
            movie.vote_average > 7
          ));

          for (const movie of filteredDataProximosEstrenos) {
            if (!proximosEstrenos.has(movie.id)) {
              proximosEstrenos.add(movie.id);
              createMovieElement(movie, "proximosEstrenos");
              totalElementsAdded++;

              if (totalElementsAdded >= maxElements) {
                break; // Detenemos la búsqueda si hemos alcanzado el límite
              }
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
  }

  const seccionProximosEstrenos = document.querySelector("#proximosEstrenos");

  function createMovieElement(movie, category) {
    const { title, poster_path, overview } = movie;
    const IMG_PATH = "https://image.tmdb.org/t/p/w1280";

    const proximoEstreno = document.createElement("div");
    proximoEstreno.classList.add("pelicula");
    proximoEstreno.innerHTML = `
      <img src="${IMG_PATH + poster_path}" alt="${title}">
      <div class="peliculaInfo">
          <h3>${title}</h3>
      </div>
    `;

    seccionProximosEstrenos.appendChild(proximoEstreno);
  }

  fetchDataForPages();
});
