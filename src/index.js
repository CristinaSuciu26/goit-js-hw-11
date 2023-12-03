import { searchImages } from './api.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

document.addEventListener('DOMContentLoaded', function () {
  const imageContainer = document.querySelector('.gallery');
  const loadMoreButton = document.querySelector('.load-more');
  const searchTerm = document.querySelector('[type="text"]');
  const searchInput = document.querySelector('.search-input');

  let currentPage = 1;
  loadMoreButton.style.display = 'none';

  let totalImagesFound = 0;

  // Function to initiate a search
  async function initiateSearch() {
    console.log('Initiating search...');

    try {
      const data = await searchImages(searchTerm.value, currentPage);

      // Update total images found after the first search
      if (currentPage === 1) {
        totalImagesFound = data.totalHits;
        Notiflix.Notify.success(`Hooray! We found ${totalImagesFound} images.`);
      }

      updateDisplay(data);
    } catch (error) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  }

  // Function to create HTML markup for a photo card
  function createPhotoCard(image) {
    const { likes, views, comments, downloads, webformatURL, tags } = image;

    const imgMarkup = `
    <div class="photo-card">
    <a href="${webformatURL}" data-caption="${tags}">
    <img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${likes}</p>
        <p class="info-item"><b>Views:</b> ${views}</p>
        <p class="info-item"><b>Comments:</b> ${comments}</p>
        <p class="info-item"><b>Downloads:</b> ${downloads}</p>
      </div>
    </div>`;

    return imgMarkup;
  }

  // Function to update the display based on fetched data
  function updateDisplay(data) {
    // Hide the button after the first request
    loadMoreButton.style.display = 'none';

    // Clear the gallery content before displaying new results
    if (currentPage === 1) {
      imageContainer.innerHTML = '';
    }

    if (data.hits.length > 0) {
      data.hits.forEach(image => {
        // Create the photo card HTML and append it to the gallery
        const photoCardHTML = createPhotoCard(image);
        imageContainer.innerHTML += photoCardHTML;
      });

      // Display the "Load more" button if more images are available
      if (currentPage * 40 < data.totalHits) {
        loadMoreButton.style.display = 'block';
      } else {
        // Hide the button and display the notification at the end of the collection
        loadMoreButton.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      new SimpleLightbox('.gallery a', {
        captionDelay: 250,
        captionsData: 'alt',
        captionsPosition: 'bottom',
      });
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  }

  // Function to handle loading more images
  function loadMoreImages() {
    const searchTermValue = searchInput.value;
    currentPage++;
    initiateSearch(searchTermValue, currentPage);
  }
  loadMoreButton.addEventListener('click', loadMoreImages);

  // Add an event listener to the search form
  document
    .querySelector('#search-form')
    .addEventListener('submit', function (event) {
      // Prevent the default form submission behavior
      event.preventDefault();

      // Get the search term from the input field
      const searchTermValue = searchTerm.value;

      // Check if the search term is not empty
      if (searchTermValue.trim() !== '') {
        // Reset the current page to 1 when initiating a new search
        currentPage = 1;

        // Call the initiateSearch function with the new search term
        initiateSearch();
      } else {
        // Show an error or provide feedback if the search term is empty
        console.error('Please enter a search term.');
      }
    });
});
