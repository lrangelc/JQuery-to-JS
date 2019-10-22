console.log('hola mundo!');

const noCambia = "Luis";

let cambia = "@luirangelc";

function cambiarNombre(nuevoNombre) {
  cambia = nuevoNombre;
}

const getUserAll = new Promise(function (todoBien, todoMal) {
  // llamar una api
  setTimeout(function () {
    todoBien();
  }, 3000);
  setTimeout(function () {
    todoMal('se acabo el tiempo');
  }, 4000);
});

const getUser = new Promise(function (todoBien, todoMal) {
  // llamar una api
  setTimeout(function () {
    todoBien();
  }, 3000);
  setTimeout(function () {
    todoMal('se acabo el tiempo');
  }, 5000);
});

getUser
  .then(function () {
    console.log('todo esta bien en la vida');
  })
  .catch(function (msg) {
    console.log('error en la ejecucion.', msg);
  });


Promise.all([
  getUser,
  getUserAll
])
  .then(function () {
    console.log("completo todo");
  })
  .catch(errorProcesos);

function errorProcesos(msg) {
  console.log("no termino todos los procesos", msg);
}

// AJAX
$.ajax({
  url: 'https://randomuser.me/api/',
  dataType: 'json',
  success: function (data) {
    console.log(data);
    console.log("ajax");
    console.log(data.results[0].gender);
  },
  error: function (err) {
    console.log("error al llamar la api", err);
  }
});

fetch('https://jsonplaceholder.typicode.com/users')
  .then(function (res) {
    return res.json()
  })
  .then(function (data) {
    console.log("fetch - 1");
    console.log(data[0].name);
  })
  .catch(function (err) {
    console.log(err);
  });

fetch('https://randomuser.me/api/')
  .then(function (res) {
    return res.json()
  })
  .then(function (data) {
    console.log("fetch - 2");
    console.log(data.results[0].gender);
  })
  .catch(function (err) {
    console.log(err);
  });

// (async function load() {
//   // await 
//   try {
//     const res = await fetch('https://yts.lt/api/v2/list_movies.json?genre=action');
//     const data = await res.json();
//     console.log('Peliculas:')
//     console.log(data);


//     const $actionContainer = document.querySelector('#action');
//     const $dramaContainer = document.getElementById('drama');

//   }
//   catch (err) {
//     console.log('error al ejectura fetch korn', err);
//   }
// })();

const BASE_API = 'https://yts.lt/api/v2/';

async function getData(uri) {
  const res = await fetch(uri);
  const data = await res.json();
  return data;
}

function setAttributes($element, attributes) {
  for (const attribute in attributes) {
    $element.setAttribute(attribute, attributes[attribute]);
  }
}

const $form = document.getElementById('form');
const $featuringContainer = document.getElementById('featuring');

function featureTemplate(movie) {
  return (
    `
<div class="featuring">
  <dif class="faturing-image">
    <img = src="${movie.medium_cover_image}" width="70px" height="100" alt="">
  </div>
<div class="featuring-content">
  <p class="featuring-title">Pelicula encontrada</p>
  <p class="featuring-album">${movie.title}</p>
</div>
  `);
}

function featureErrorTemplate() {
  return (
    `
    <div class="featuring">
    <div class="featuring-content">
      <p class="featuring-title">Lo sentimos</p>
      <p class="featuring-album">La pelicula solicitada no fue encontrada</p>
    </div>
  </div>
  `);
}

$form.addEventListener('submit', async (e) => {
  // evita que haga el submit
  e.preventDefault();

  const $home = document.getElementById('home');

  $home.classList.add('search-active');

  const $loader = document.createElement('img');
  setAttributes($loader, {
    src: 'src/images/loader.gif',
    height: 50,
    width: 50
  });

  $featuringContainer.firstChild.remove();
  $featuringContainer.append($loader);

  const data = new FormData(form);

  let xx;
  const movie = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)
    // .then(({ data: { movies: pelis } }) => {
    .then((res) => {
      xx = res;
      $featuringContainer.children[0].remove();
      let HTMLString;
      if (res.data.movies.length != 0) {
        HTMLString = featureTemplate(res.data.movies[0]);
      } else {
        HTMLString = featureErrorTemplate();
      }
      $featuringContainer.innerHTML = HTMLString;
    })
    .catch(() => {
      let HTMLString = featureErrorTemplate();
      $featuringContainer.innerHTML = HTMLString;
    });
  console.log(movie);
  console.log(xx);
});

const $hideModal = document.getElementById('hide-modal');
$hideModal.addEventListener('click', hideModal);

function hideModal() {
  const $overlay = document.getElementById('overlay');
  const $modal = document.getElementById('modal');

  $overlay.classList.remove('active');
  $modal.style.animation = 'modalOut .8s forwards';
}

function showModal($element) {
  const $overlay = document.getElementById('overlay');
  const $modal = document.getElementById('modal');

  const $modalTitle = $modal.querySelector('h1');
  const $modalImage = $modal.querySelector('img');
  const $modalDescription = $modal.querySelector('p');

  $overlay.classList.add('active');
  $modal.style.animation = 'modalIn .8s forwards';

  const id = $element.dataset.id;
  const category = $element.dataset.category;
  const title = $element.dataset.title;

  const data = findMovie(id, category);

  $modalTitle.textContent = data.title;
  $modalImage.setAttribute('src', data.medium_cover_image);
  $modalDescription.textContent = data.description_full;
}

function findList(list, id) {
  return list.find(movie => movie.id === parseInt(id));
}

function findMovie(id, category) {
  switch (category) {
    case "action": {
      return findList(actionList, id);
    }
    case "drama": {
      return findList(dramaList, id);
    }
    default: {
      return findList(animationList, id);
    }
  }
}

function addClickMovie(movieId) {
  const $movie = document.getElementById(`movie_${movieId}`);

  $movie.addEventListener('click', function () {
    showModal($movie);
  });
}

function videoItemTemplate(movieId, src, title, movie, category) {
  return (
    `<div class="primaryPlaylistItem" id="movie_${movieId}" data-id="${movie.id}" data-category="${category}" data-title="${title}">
      <div class="primaryPlaylistItem-image">
        <img src="${src}" class="fadeIn">
      </div>
      <h4 class="primaryPlaylistItem-title">${title}</h4>
    </div>`
  );
}

function loadingImage() {
  return (`<img src="src/images/loader.gif" width="50" height="50" alt="cargando peliculas">`);
}

async function cacheExists(type) {
  const listName = `${type}List`;
  const cacheList = window.sessionStorage.getItem(listName);

  if (cacheList) {
    return JSON.parse(cacheList);
  } else {
    const data = await getData(`${BASE_API}list_movies.json?genre=${type}`);
    window.sessionStorage.setItem(listName, JSON.stringify(data));
    return data;
  }
}

async function loadMovie(type) {
  try {
    const $movieContainer = document.getElementById(type);
    $movieContainer.innerHTML = loadingImage();

    const data = await cacheExists(type);
    // const data = await getData(`${BASE_API}list_movies.json?genre=${type}`);

    renderMovieList(data, $movieContainer, type);

    return data.data.movies;
  }
  catch (err) {
    console.log('error al ejectura loadMovie', err);
  }
}

function renderMovieList(data, $container, category) {
  let stringHTML = "";

  data.data.movies.forEach((movie) => {
    const HTMLString = videoItemTemplate(movie.id, movie.medium_cover_image, movie.title, movie, category);
    stringHTML += HTMLString;
  });
  $container.innerHTML = stringHTML;

  data.data.movies.forEach((movie) => {

    addClickMovie(movie.id);
  });
}

var animationList = null;
var actionList = null;
var dramaList = null;

const promise1 = loadMovie('drama')
  .then((res) => {
    dramaList = res;
  });
const promise2 = loadMovie('action')
  .then((res) => {
    actionList = res;
  });
const promise3 = loadMovie('animation')
  .then((res) => {
    animationList = res;
  });

// promise3
//   .then((res) => {
//     console.log("animationList");
//     console.log(animationList);
//     console.log(res);
//     debugger
//   });

// setTimeout(function () {
//   loadMovie('action');
// }, 10000);