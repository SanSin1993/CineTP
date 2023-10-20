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
  961268
];

// Lista de IDs de películas seleccionadas para próximos estrenos (solo 4 películas)
const selectedProximosEstrenosIDs = [
  554600,
  615656,
  980489,
  385687
];

// Filtrar próximos estrenos para asegurarse de que no se repitan con la cartelera
const uniqueProximosEstrenosIDs = selectedProximosEstrenosIDs.filter(id => !selectedCarteleraMovieIDs.includes(id));

// Cargar las películas seleccionadas en próximos estrenos
loadSelectedMovies(uniqueProximosEstrenosIDs, 'proximosEstrenos');

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

  // Almacenar la película en el localStorage correspondiente si aún no está almacenada
  const storedMovie = getStoredMovieData(movie.id, category);
  if (!storedMovie) {
    storeMovieData(movie.id, category);
  }

  peliculaElegida.addEventListener('click', () => {
    // Obtener la fecha de estreno de la película y mostrarla
    const releaseDate = getMovieReleaseDate(movie.id, category);
    if (releaseDate) {
      alert(`Fecha de estreno: ${releaseDate}`);
    }
  });
}

// Función para almacenar datos de película en localStorage
function storeMovieData(movieID, category) {
  if (!localStorageData[category]) {
    localStorageData[category] = [];
  }
  localStorageData[category].push({ id: movieID, releaseDate: generateRandomDate() });
  localStorage.setItem('peliculas', JSON.stringify(localStorageData));
}

// Función para obtener datos de película almacenados en localStorage
function getStoredMovieData(movieID, category) {
  if (localStorageData[category]) {
    return localStorageData[category].find(movie => movie.id === movieID);
  }
  return null;
}

// Función para obtener la fecha de estreno de una película
function getMovieReleaseDate(movieID, category) {
  const storedMovie = getStoredMovieData(movieID, category);
  return storedMovie ? storedMovie.releaseDate : null;
}
