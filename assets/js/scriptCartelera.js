//PeliculaResponse {
//  page;  //number;
//  results;  //pelicula
//  total_pages; //Number
//  total_results; //Number
// };

//Pelicula {
//  adult; //Boolean
//  backdrop_path; //String
//  genre_ids; //[ Number]
//  id; //Number
//  original_language; //String
//  original_title; //String
//  overview; //String
//  popularity; //Float
//  poster_path; //String
//  release_date; //Date
//  title; //String
//  video; //Boolean
//  vote_average; //Float
//  vote_count; //Number
// };

document.addEventListener('DOMContentLoaded', function () {

  if (logo) {
    logo.addEventListener("click", () => {
        window.location.href = "../index.html";
    });
}

  const apiKey = '7f194cf23e4e2305fe113aa39e25592f';
const baseUrl = 'https://api.themoviedb.org/3/discover/movie';
const main = document.querySelector('.main');
const startPage = 1;
const endPage = 10;
// Obtener la fecha actual en formato ISO (AAAA-MM-DD)
const currentDate = new Date().toISOString().split('T')[0];

// Inicializar la lista de datos filtrados
const filteredMovieData = [];
const maxElements = 12 // Límite de elementos

// Función para obtener datos de películas
async function fetchDataForPages() {
  let page = 1;
  let totalElementsAdded = 0; // Rastrear la cantidad de elementos agregados

  while (page <= 10 && totalElementsAdded < maxElements) {
    const apiUrl = `https://api.themoviedb.org/3/discover/movie?page=${page}&api_key=${apiKey}&language=es-ES`;
    
    try {
      const response = await fetch(apiUrl);

      if (response.ok) {
        const data = await response.json();
        // Filtrar los elementos
        const filteredData = data.results.filter(movie => (
          movie.original_language === "en" &&
          movie.release_date <= currentDate && // Comparar con la fecha actual
          movie.vote_average > 7
        ));

        if (filteredData.length > 0) {
          // Calcular cuántos elementos se pueden agregar sin exceder el límite
          const elementsToAdd = Math.min(filteredData.length, maxElements - totalElementsAdded);
          const moviesToAdd = filteredData.slice(0, elementsToAdd);

          // Agregar los elementos filtrados a la lista
          filteredMovieData.push(...moviesToAdd);
          totalElementsAdded += elementsToAdd; // Actualizar la cantidad de elementos agregados
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

async function loadMovies() {
  try {
    await fetchDataForPages();
    const peliculasCartelera = filteredMovieData.map(pelicula => pelicula.id);
    for (const movieID of peliculasCartelera) {
      const movieData = await getMovieDetails(movieID);
      if (movieData) {
        createMovieElement(movieData, 'cartelera');
      }
    }
  } catch (error) {
    console.error('Error al cargar películas:', error);
  }
}



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

function createMovieElement(movie, category) {
  const { title, poster_path, overview } = movie;
  const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

  const peliculaElegida = document.createElement('div');
  peliculaElegida.classList.add('pelicula');
  peliculaElegida.innerHTML = `
    <div class="peli" data-poster-path="${movie.poster_path}">
      <img src="${IMG_PATH + poster_path}" alt="${title}">
      <div class="peliculaInfo">
          <h3>${title}</h3>
      </div>

    </div>
  `;

  main.appendChild(peliculaElegida);

  // Agregar un evento click a la película para redirigir a "sacarEntrada.html"
  peliculaElegida.addEventListener("click", function () {
    const movieID = movie.id; // Obtener el ID de la película desde el objeto "movie"
    let timerInterval;
    Swal.fire({
      title: "¡Disfruta de la magia del cine!",
      timer: 3000,
      timerProgressBar: false,
      didOpen: () => {
        Swal.showLoading();
        const b = Swal.getHtmlContainer().querySelector("b");
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft();
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
        window.location.href = `../pages/sacarEntrada.html?id=${movieID}`;
      }
    });
});
}

// Llama a la función para cargar películas
loadMovies();

// Convertir filteredMovieData en una cadena JSON
const filteredMovieDataJSON = JSON.stringify(filteredMovieData);

// Almacenar la cadena JSON en localStorage
localStorage.setItem('filteredMovieData', filteredMovieDataJSON);



 });