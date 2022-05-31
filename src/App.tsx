import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from './store';

// import { Loader } from '@googlemaps/js-api-loader';
import Map, { LatLng } from './Map';
import Timeline from './Timeline';
import { left, right } from './Reducer/headingSlice';
import Run from './Run';
import { set } from './Reducer/lagLngSlice';



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
  // const [center, setCenter] = useState<LatLng>({ lat: 30, lng: -110 });
  const [zoom, setZoom] = useState(10);
  const lagLng = useSelector((rootState: RootState) => rootState.latLng);
  const dispatch = useDispatch();
  const rotateLeft = useCallback(() => dispatch(left()), [dispatch]);
  const rotateRight = useCallback(() => dispatch(right()), [dispatch]);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const geoLagLng = { lat: position.coords.latitude, lng: position.coords.longitude };
      // setCenter(geoLagLng);
      dispatch(set(geoLagLng));
    }, err => {
      console.error(err);
    });
  };

  return (
    <>
      <div className="left">
        <Map zoom={zoom} center={lagLng} />
      </div>
      <div className="right">
        <button onClick={getLocation}>Get My Location</button>
        <button onClick={() => setZoom(z => z + 1)}>+</button>
        <button onClick={() => setZoom(z => z - 1)}>-</button>
        <button onClick={rotateLeft}>left</button>
        <button onClick={rotateRight}>right</button>
        <Run />
        <div>{`lat: ${lagLng.lat}, lng: ${lagLng.lng}`}</div>
        <Timeline />
      </div>
    </>
  );
};
export default App;
