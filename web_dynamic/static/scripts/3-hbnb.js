#!/usr/bin/node
/* global $ */
$(document).ready(function () {
  $.ajax({
    type: 'GET',
    url: 'http://localhost:5001/api/v1/status/',
    dataType: 'json',
    success: function (response) {
      if (response.status === 'OK') {
        $('.api_status').addClass('available');
      }
    }
  });

  const url = 'http://localhost:5001/api/v1/places_search/';
  $.ajax({
    type: 'POST',
    url,
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: function (response) {
      for (const place of response) {
        const article = `
          <article>
            <div class="title_box">
              <h2>${place.name}</h2>
              <div class="price_by_night">${place.price_by_night}</div>
            </div>
            <div class="information">
              <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
              <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
              <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
            </div>
            <div class="description">
              ${place.description}
            </div>
          </article>
        `;
        $('.places').append(article);
      }
    }
  });
});
