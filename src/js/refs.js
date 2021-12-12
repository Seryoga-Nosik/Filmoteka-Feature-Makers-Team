export default function getRefs() {
  return {
    header: document.querySelector('header'),
    logo: document.querySelector('.logo'),
    navList: document.querySelector('.site-nav-list'),
    homeLink: document.querySelector('.home-link'),
    myLibraryLink: document.querySelector('.my-library-link'),
    changeableBlock: document.querySelector('.changeable-block'),
    searchBox: document.querySelector('.form-search__input'),
    gallery: document.querySelector('.gallery'),
    modal: document.querySelector('.modal-form'),
    modalСard: document.querySelector('.modal__card'),
    clsBtn: document.querySelector('.modal__close-btn'),
    pagination: document.querySelector('.pagination-container'),
    toTopBtn: document.querySelector('.uptop'),
  };
}
