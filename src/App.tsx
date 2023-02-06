import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from './store';

import Map from './Map';
import Timeline from './Timeline';
import Run from './Run';
import { setCenter, setZoom } from './Reducer/mapControlSlice';
import Rec from './Recorder';

const App = () => {
  const { latLng: center, zoom } = useSelector((rootState: RootState) => rootState.mapControl);
  const [inputZoom, setInputZoom] = useState(zoom.toString());
  const dispatch = useDispatch();
  useEffect(() => {
    setInputZoom(zoom.toString());
  }, [zoom]);
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const geoLagLng = { lat: position.coords.latitude, lng: position.coords.longitude };
      dispatch(setCenter(geoLagLng));
    }, err => {
      console.error(err);
    });
  };
  const submitZoom = () => {
    const z = Number.parseFloat(inputZoom) || zoom;
    dispatch(setZoom(z));
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
        <div>
          <label htmlFor="zoom">
            Zoom:
            <input
              name="zoom"
              value={inputZoom}
              type="number"
              onChange={e => setInputZoom(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  submitZoom();
                }
              }}
            />
            <button
              type="submit"
              onClick={submitZoom}
            >
              set zoom
            </button>
          </label>
        </div>
        <Timeline />
      </div>
    </>
  );
};
export default App;
