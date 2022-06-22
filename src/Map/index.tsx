import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Wrapper, Status } from '@googlemaps/react-wrapper';

import { add } from '../Reducer/markersSlice';
import { RootState } from '../store';
import { LatLng } from '../Reducer/mapControlSlice';
import { Marker, Markers, Polyline } from './Components';

const apiKey = 'AIzaSyCF5RGzHDQiJgVTfpmszEHM1dXlEXx-B4g';
const mapId = 'e3d3436438fcc6d9';

interface MapProps {
  zoom: number;
  // center: LatLng;
}

const MapContent: React.FC<MapProps> = ({ zoom }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  // const markerIndex = useRef(0);
  const markers = useSelector((rootState: RootState) => rootState.markers);
  const heading = useSelector((rootState: RootState) => rootState.mapControl.heading);
  const center = useSelector((rootState: RootState) => rootState.mapControl.latLng);
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
  }, [map, zoom]);
  useEffect(() => {
    map?.setHeading(heading);
  }, [map, heading]);
  useEffect(() => {
    if (map) {
      const listener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const latLng: LatLng = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          };
          dispatch(add({
            position: latLng,
            time: 0,
            createTime: Date.now(),
          }));
        }
        e.stop();
      });
      return listener.remove;
    }
  }, [map, dispatch]);

  return (
    <>
      <div id="map" ref={ref} />
      <Marker map={map} index={-1} option={{ createTime: 0, position: center, time: 0 }} />
      <Markers map={map} options={markers.markers} />
      <Polyline map={map} path={markers.markers.map(marker => marker.position)} />
    </>
  );
};

const render = (status: Status) => <h1>{status}</h1>;
const Map: React.FC<MapProps> = args => (
  <Wrapper apiKey={apiKey} render={render}>
    <MapContent {...args} />
  </Wrapper>
);

export default Map;
