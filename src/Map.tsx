import React, { useState, useRef, useEffect } from 'react';

import { Wrapper, Status } from '@googlemaps/react-wrapper';

const apiKey = 'AIzaSyCF5RGzHDQiJgVTfpmszEHM1dXlEXx-B4g';

export type LatLng = google.maps.LatLngLiteral;

interface MapProps {
  zoom: number;
  center: LatLng;
}

const MapContent: React.FC<MapProps> = ({ zoom, center }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, { center, zoom }));
    }
  }, [ref, map, center, zoom]);
  useEffect(() => {
    if (map) {
      map.setCenter(center);
    }
  }, [center]);
  useEffect(() => {
    if (map) {
      map.setZoom(zoom);
    }
  }, [zoom]);

  return (<div id="map" ref={ref} />);
};

const render = (status: Status) => <h1>{status}</h1>;

const Map: React.FC<MapProps> = args => (
  <Wrapper apiKey={apiKey} render={render}>
    <MapContent {...args} />
  </Wrapper>
);
export default Map;
