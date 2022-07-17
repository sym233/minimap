import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from './store';

import Map from './Map';
import Timeline from './Timeline';
import Run from './Run';
import { setCenter } from './Reducer/mapControlSlice';
import Rec from './Recorder';

const App = () => {
  const { latLng: center, zoom } = useSelector((rootState: RootState) => rootState.mapControl);
  const dispatch = useDispatch();
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
        <Map />
      </div>
      <div className="right">
        <div>
          <button onClick={getLocation} type="button">Get My Location</button>
          <Run />
          <Rec />
        </div>
        <div>{`lat: ${center.lat}, lng: ${center.lng}`}</div>
        <div>{`zoom: ${zoom}`}</div>
        <Timeline />
      </div>
    </>
  );
};
export default App;
