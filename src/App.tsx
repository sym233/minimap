import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from './store';

import Map from './Map';
import Timeline from './Timeline';
import Run from './Run';
import { setCenter, rotateHeadingBy } from './Reducer/mapControlSlice';
import Rec from './Recorder';

const App = () => {
  const [zoom, setZoom] = useState(10);
  const center = useSelector((rootState: RootState) => rootState.mapControl.latLng);
  const dispatch = useDispatch();
  const rotateLeft = useCallback(() => dispatch(rotateHeadingBy(-10)), [dispatch]);
  const rotateRight = useCallback(() => dispatch(rotateHeadingBy(10)), [dispatch]);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const geoLagLng = { lat: position.coords.latitude, lng: position.coords.longitude };
      dispatch(setCenter(geoLagLng));
    }, err => {
      console.error(err);
    });
  };

  return (
    <>
      <div className="left">
        <Map zoom={zoom} />
      </div>
      <div className="right">
        <button onClick={getLocation}>Get My Location</button>
        <button onClick={() => setZoom(z => z + 1)}>+</button>
        <button onClick={() => setZoom(z => z - 1)}>-</button>
        <button onClick={rotateLeft}>left</button>
        <button onClick={rotateRight}>right</button>
        <Run />
        <Rec />
        <div>{`lat: ${center.lat}, lng: ${center.lng}`}</div>
        <Timeline />
      </div>
    </>
  );
};
export default App;
