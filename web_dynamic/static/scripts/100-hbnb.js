#!/usr/bin/node
/* global $ */
$(document).ready(() => {
  let amenities = {};
  // check if input is checked to change ...
  $('.amenities input[type="checkbox"]').change(() => {
    amenities = {};

    $('input[type="checkbox"]:checked').each(function () {
      amenities[$(this).data('id')] = $(this).data('name');
    });

    const amenText = $('.amenities h4').html('&nbsp;');
    const initWidth = amenText.width();

    let i = 0;
    for (const key in amenities) {
      if (amenText.width() > initWidth) {
        amenText.append('...');
        break;
      }

      if (i >= 1) {
        amenText.append(', ');
      }

      const amen = amenities[key];
      for (let j = 0; j < amen.length; j++) {
        if (amenText.width() > initWidth) {
          amenText.append('...');
          break;
        }
        amenText.append(amen[j]);
      }
      i++;
    }
  });

  // Function to update the status
  function updateApiStatus () {
    $.get('http://127.0.0.1:5001/api/v1/status/', (data) => {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    }).fail(() => {
      $('#api_status').removeClass('available');
    });
  }

  // Initial status update
  updateApiStatus();
  setInterval(updateApiStatus, 30000);

  // Function to create a Place article element
  function createPlaceArticle (place) {
    const article = $('<article>', {
      html: `
        <div class="title_box">
          <h2>${place.name}</h2>
          <div class="price_by_night">$${place.price_by_night}</div>
        </div>
        <div class="information">
          <div class="max_guest">${place.max_guest} Guests</div>
          <div class="number_rooms">${place.number_rooms} Bedrooms</div>
          <div class="number_bathrooms">${place.number_bathrooms} Bathroom</div>
        </div>
        <div class="description">
          ${place.description}
        </div>
      `
    });
    return article;
  }

  // Function to update the places section
  function updatePlacesSection (places) {
    const placesSection = $('section.places');
    // Clear the existing content
    placesSection.empty();

    $.each(places, (index, place) => {
      const placeArticle = createPlaceArticle(place);
      placesSection.append(placeArticle);
    });
  }
  // Send a POST request to the API endpoint using jQuery
  function fetchPlacesWithAmenities () {
    $.ajax({
      url: 'http://127.0.0.1:5001/api/v1/places_search',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ amenities: Object.keys(amenities) }),
      success: function (data) {
        updatePlacesSection(data);
      },
      error: function (error) {
        console.error('Error fetching data:', error);
      }
    });
  }
  // Button click event to trigger the search with amenities
  $('button.submit_search').click(function () {
    fetchPlacesWithAmenities();
  });
  fetchPlacesWithAmenities();
});
