import React, { useEffect, useState } from 'react';

import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';

import {
  currentCenter,
  mapStatus,
  timeline,
} from './store';

import Map from './Map';
import Timeline from './Timeline';
import Run from './Run';
import Rec from './Recorder';

const App = observer(() => {
  const { zoom } = mapStatus;
  const { lat, lng } = currentCenter;
  const [inputZoom, setInputZoom] = useState(zoom.toString());
  useEffect(() => {
    setInputZoom(zoom.toString());
  }, [zoom]);
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const geoLagLng = { lat: position.coords.latitude, lng: position.coords.longitude };
      runInAction(() => {
        mapStatus.latLng = geoLagLng;
      });
    }, err => {
      console.error(err);
    });
  };
  const submitZoom = () => {
    const z = Number.parseFloat(inputZoom) || zoom;
    runInAction(() => {
      mapStatus.zoom = z;
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
        <div>{`lat: ${lat.toFixed(6)}, lng: ${lng.toFixed(6)}`}</div>
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
        <Timeline tl={timeline} />
      </div>
    </>
  );
});
export default App;
