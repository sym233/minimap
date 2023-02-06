import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Wrapper, Status } from '@googlemaps/react-wrapper';

import { add } from '../Reducer/markersSlice';
import { RootState } from '../store';
import { LatLng, setZoom } from '../Reducer/mapControlSlice';
import {
  Compass, Markers, Nav, Polyline,
} from './Components';

const apiKey = 'AIzaSyCF5RGzHDQiJgVTfpmszEHM1dXlEXx-B4g';
const mapId = 'e3d3436438fcc6d9';

const mapSize = 600;

/* global google */

const MapContent: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const markers = useSelector((rootState: RootState) => rootState.markers);
  const {
    heading,
    latLng: center,
    running,
    zoom,
  } = useSelector((rootState: RootState) => rootState.mapControl);
  const zoomRef = useRef(zoom);
  const dispatch = useDispatch();
  useEffect(() => {
    if (ref.current && !map) {
      const m = new window.google.maps.Map(ref.current, { center, zoom, mapId });
      setMap(m);
    }
  }, [ref, map, center, zoom]);
  useEffect(() => {
    // map?.setCenter(center);
    map?.panTo(center);
  }, [map, center]);
  useEffect(() => {
    map?.setZoom(zoom);
    zoomRef.current = zoom;
  }, [map, zoom]);
  useEffect(() => {
    map?.setHeading(heading);
  }, [map, heading]);
  useEffect(() => {
    map?.setOptions({ disableDefaultUI: running });
  }, [map, running]);
  useEffect(() => {
    if (map) {
      const clickListener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng && markers.show) {
          const latLng: LatLng = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          };
          dispatch(add({
            position: latLng,
            time: 0,
            createTime: Date.now(),
            zoom: zoomRef.current,
            // wait: 0,
          }));
        }
        e.stop();
      });
      const zoomListener = map.addListener('zoom_changed', () => {
        const z = map.getZoom();
        if (z) {
          dispatch(setZoom(z));
        }
      });
      return () => {
        clickListener.remove();
        zoomListener.remove();
      };
    }
  }, [map, dispatch, markers.show]);

  return (
    <>
      <div id="map" style={{ height: mapSize, width: mapSize }} ref={ref} />
      {running && <Nav size={20} mapSize={mapSize} />}
      <Compass size={50} mapSize={mapSize} heading={heading} />
      {markers.show && <Markers map={map} options={markers.markers} />}
      {markers.show && <Polyline map={map} path={markers.markers.map(marker => marker.position)} />}
    </>
  );
};

const render = (status: Status) => <h1>{status}</h1>;
const Map: React.FC = () => (
  <Wrapper apiKey={apiKey} render={render}>
    <MapContent />
  </Wrapper>
);

export default Map;
