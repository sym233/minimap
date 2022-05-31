// import { Loader } from '@googlemaps/js-api-loader';

// const apiKey = 'AIzaSyCF5RGzHDQiJgVTfpmszEHM1dXlEXx-B4g';

// const loader = new Loader({
//   apiKey,
//   version: 'weekly',
// });

// type LatLng = google.maps.LatLngLiteral;

// let map: google.maps.Map;
// let center: LatLng;
// const display = document.getElementById('location')!;

// function initMap(): void {
//   center = center ?? { lat: 30, lng: -110 };
//   map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
//     center,
//     zoom: 8,
//     // disableDefaultUI: true,
//   });
//   map.addListener('click', (e: google.maps.MapMouseEvent) => {
//     if (e.latLng) {
//       const {lat, lng} = e.latLng;
//       display.innerHTML = `You Clicked at lat: ${lat()}, lng: ${lng()}`;
//     } else {
//       display.innerHTML = 'No laglng'
//     }
//   })
// }

// document.getElementById('get_location')!.addEventListener('click', () => {
//   display.innerHTML = 'Getting location...';
//   navigator.geolocation.getCurrentPosition(position => {
//     center = { lat: position.coords.latitude, lng: position.coords.longitude };
//     display.innerHTML = `lat: ${center.lat}, lng: ${center.lng}`;
//   }, err => {
//     display.innerHTML = err.message;
//   });
// });

// document.getElementById('load_map')!.addEventListener('click', () => {
//   loader.load().then(initMap);
// });

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App';
import { store } from './store';

const container = document.getElementById('app')!;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
