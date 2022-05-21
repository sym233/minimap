import React, { useState } from 'react';
// import { Loader } from '@googlemaps/js-api-loader';
import Map, { LatLng } from './Map';



// type LatLng = google.maps.LatLngLiteral;

// let map: google.maps.Map;
// let center: LatLng;
// // const display = document.getElementById('location')!;

// function initMap(): void {
//   center = center ?? { lat: 30, lng: -110 };
//   map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
//     center,
//     zoom: 8,
//     // disableDefaultUI: true,
//   });
//   // map.addListener('click', (e: google.maps.MapMouseEvent) => {
//   //   if (e.latLng) {
//   //     const { lat, lng } = e.latLng;
//   //     display.innerHTML = `You Clicked at lat: ${lat()}, lng: ${lng()}`;
//   //   } else {
//   //     display.innerHTML = 'No laglng'
//   //   }
//   // })
// }
const App = () => {
  const [loadMap, setLoadMap] = useState(false);
  const [center, setCenter] = useState<LatLng>({ lat: 30, lng: -110 });
  const [zoom, setZoom] = useState(10);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const lagLng = { lat: position.coords.latitude, lng: position.coords.longitude };
      setCenter(lagLng);
    }, err => {
      console.error(err);
    });
  };

  return (
    <>
      <button onClick={getLocation}>Get My Location</button>
      <button onClick={() => setLoadMap(true)}>Load Map</button>
      <button onClick={() => setZoom(z => z + 1)}>+</button>
      <button onClick={() => setZoom(z => z - 1)}>-</button>

      {/* <div></div> */}
      {/* { loadMap? <Map /> : null } */}
      <Map zoom={zoom} center={center} />
    </>
  );
};
export default App;
