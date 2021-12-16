import getRefs from '../refs';
const refs = getRefs();
//import frow watched and queue
import { fetchQueueFilms } from '../components/firebase/fetchFromFirebase';
import { fetchWatchedFilms } from '../components/firebase/fetchFromFirebase';
import { getMovieId } from '../apiService';
import watched from '../../template/listFilms.hbs';
import { renderTrandingFilms } from './gallery';
import { runSpinner, stopSpinner } from './spinner';
import { DEBOUNCE_DELAY } from '../constants';
import { onSearch } from './search';
import debounce from 'lodash.debounce';

refs.navList.addEventListener('click', onNavItemClick);
refs.myLibraryLink.addEventListener('click', onMyLibLinkClick);
refs.homeLink.addEventListener('click', onHomeLinkClick);
refs.logo.addEventListener('click', onLogoClick);

checkCurrentPage();
document
  .querySelector('.form-search__input')
  .addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
// refs.formSearch.addEventListener('submit', onSearch);

function onNavItemClick(event) {
  if (event.target.nodeName !== 'A') {
    return;
  }

  let navLinks = document.querySelectorAll('.site-nav-list__link');
  for (let i = 0; i < navLinks.length; i += 1) {
    if (navLinks[i] !== event.target) {
      navLinks[i].classList.remove('is-current');
    }
  }
  event.target.classList.add('is-current');

  checkCurrentPage();
}

function onMyLibLinkClick(event) {
  event.preventDefault();
  refs.header.classList.remove('home-header');
  refs.header.classList.add('my-lib-header');
  refs.pagination.classList.add('is-hidden');
}

function onHomeLinkClick(event) {
  event.preventDefault();

  refs.header.classList.remove('my-lib-header');
  refs.header.classList.add('home-header');
  refs.pagination.classList.remove('is-hidden');

  document.location.reload();
}

function onLogoClick(event) {
  event.preventDefault();

  if (refs.header.classList.contains('my-lib-header')) {
    refs.header.classList.remove('my-lib-header');
  }
  refs.header.classList.add('home-header');
  refs.homeLink.classList.add('is-current');
  refs.myLibraryLink.classList.remove('is-current');

  checkCurrentPage();
  document
    .querySelector('.form-search__input')
    .addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
  // document.location.reload();
  renderTrandingFilms();
}

function checkCurrentPage() {
  refs.changeableBlock.innerHTML = '';

  if (refs.homeLink.classList.contains('is-current')) {
    const searchMarkup = `<form class="form-search" id="form-search">
        <input
          class="form-search__input"
          type="text"
          name="searchQuery"
          autocomplete="off"
          placeholder="Find movies..."
        />
        </form>`;

    refs.changeableBlock.insertAdjacentHTML('beforeend', searchMarkup);
    localStorage.setItem('current-page', 'home');
  } else {
    const buttonsMarkup = `<div class="buttons-block">
        <button type="button" class="button primary-button">Watched</button>
        <button type="button" class="button secondary-button">Queue</button>
        </div>`;
    refs.changeableBlock.insertAdjacentHTML('beforeend', buttonsMarkup);
    localStorage.setItem('current-page', 'my-library');
  }
}

document.addEventListener('click', onMyLibraryLinkClick);
document.addEventListener('click', onWatchedBtnClick);
document.addEventListener('click', onQueueBtnClick);

function onMyLibraryLinkClick(e) {
  if (e.target == getRefs().myLibraryLink) {
    runSpinner();
    getRefs().myLibraryLink.setAttribute('data-active', 'watched');
    refs.gallery.innerHTML = '';
    fetchWatchedFilms();
    stopSpinner();
    showEmptyState();
  }
}

function onWatchedBtnClick(e) {
  if (e.target == getRefs().btnWatched) {
    getRefs().myLibraryLink.setAttribute('data-active', 'watched');
    getRefs().btnWatched.style.backgroundColor = '#ff6b01';
    getRefs().btnWatched.style.border = 'none';
    getRefs().btnQueue.style.backgroundColor = 'rgba(145, 145, 145, 0.25)';
    getRefs().btnQueue.style.border = '1px solid #fff';
    refs.gallery.innerHTML = '';
    fetchWatchedFilms();
    showEmptyState();
  }
}

function onQueueBtnClick(e) {
  if (e.target == getRefs().btnQueue) {
    getRefs().myLibraryLink.setAttribute('data-active', 'queue');
    getRefs().btnQueue.style.backgroundColor = '#ff6b01';
    getRefs().btnQueue.style.border = 'none';
    getRefs().btnWatched.style.backgroundColor = 'rgba(145, 145, 145, 0.25)';
    getRefs().btnWatched.style.border = '1px solid #fff';
    refs.gallery.innerHTML = '';
    fetchQueueFilms();
    showEmptyState();
  }
}

export function render(films, path) {
  refs.gallery.innerHTML = '';
  if (path === 'watched') {
    runSpinner();
    for (const film of films) {
      getMovieId(film).then(data => {
        const markup = watched(data);
        refs.gallery.insertAdjacentHTML('beforeend', markup);

        hideEmptyState();
        stopSpinner();
      });
    }
  } else {
    runSpinner();

    for (const film of films) {
      getMovieId(film).then(data => {
        const markup = watched(data);
        refs.gallery.insertAdjacentHTML('beforeend', markup);

        hideEmptyState();
        stopSpinner();
      });
    }
  }
}

export function renderInModaBtnClick(films, path) {
  if (getRefs().homeLink.classList.contains('is-current')) {
    return;
  } else if (getRefs().myLibraryLink.classList.contains('is-current')) {
    runSpinner();

    refs.gallery.innerHTML = '';
    if (films.length === 0) {
      showEmptyState();
    } else {
      for (const film of films) {
        getMovieId(film).then(data => {
          const markup = watched(data);
          refs.gallery.insertAdjacentHTML('beforeend', markup);
        });
      }
    }

    stopSpinner();
  }
}

function hideEmptyState() {
  const savedPage = localStorage.getItem('current-page');
  const galleryCard = document.querySelector('.gallery__card');
  if (savedPage === 'my-library' && galleryCard) {
    console.log('there is a card');
    refs.emptyLibrary.classList.add('is-hidden');
  }
}

function showEmptyState() {
  const savedPage = localStorage.getItem('current-page');
  if (savedPage === 'my-library' && refs.gallery.innerHTML === '') {
    refs.emptyLibrary.classList.remove('is-hidden');
  }
}
