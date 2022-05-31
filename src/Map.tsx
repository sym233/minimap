import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Wrapper, Status } from '@googlemaps/react-wrapper';

// import { set } from './Reducer/lagLngSlice';
import { add, MarkerOption } from './Reducer/markersSlice';
import { RootState } from './store';

const apiKey = 'AIzaSyCF5RGzHDQiJgVTfpmszEHM1dXlEXx-B4g';
const mapId = 'e3d3436438fcc6d9';

/**
 * run effect() with custom predicate function
 * @param effect the same as useEffect parameter
 * @param dep the dependency that decides running effect()
 * @param comp compare previous and current dep's. run effect() if it returns true.
 */
// eslint-disable-next-line max-len
function useCompareEffect<T>(effect: React.EffectCallback, dep: T, comp: (oldValue: T, newValue: T) => boolean): void {
  const firstRender = useRef(true);
  const prevValue = useRef(dep);
  useEffect(() => {
    if (firstRender.current || comp(prevValue.current, dep)) {
      firstRender.current = false;
      prevValue.current = dep;
      return effect();
    }
  }, [effect, dep, comp]);
}


export type LatLng = google.maps.LatLngLiteral;


interface MarkerProps {
  map: google.maps.Map;
  option: MarkerOption;
}

const Marker: React.FC<MarkerProps> = ({ map, option }) => {
  const marker = useRef<google.maps.Marker>();
  useEffect(() => {
    marker.current = new window.google.maps.Marker({
      map,
      position: option.position,
      label: option.index.toString(),
    });
    return () => {
      marker.current?.setMap(null);
    };
  }, [marker, map, option.position]);
  return null;
};

interface MarkersProps {
  map?: google.maps.Map;
  options: MarkerOption[];
}

const Markers: React.FC<MarkersProps> = ({ map, options }) => {
  if (map) {
    return (
      <>
        {options.map(option => (
          <Marker key={option.createTime} map={map} option={option} />
        ))}
      </>
    );
  }
  return null;
};

interface MapProps {
  zoom: number;
  center: LatLng;
}

interface PolylineProps {
  map?: google.maps.Map;
  path: LatLng[];
}

const Polyline: React.FC<PolylineProps> = ({ map, path }) => {
  const polyline = useRef<google.maps.Polyline>();
  useEffect(() => {
    if (map) {
      polyline.current = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
      polyline.current.setMap(map);
      return () => polyline.current!.setMap(null);
    }
  }, [map]);
  // useEffect(() => {
  //   polyline.current?.setPath(path);
  // }, [path]);
  useCompareEffect(() => {
    polyline.current?.setPath(path);
  // eslint-disable-next-line max-len
  }, path, (oldPath, newPath) => oldPath.length !== newPath.length || oldPath.some((val, i) => val !== newPath[i]));

  return null;
};

const MapContent: React.FC<MapProps> = ({ zoom, center }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  window.map = map;
  const markerIndex = useRef(0);
  const markers = useSelector((rootState: RootState) => rootState.markers);
  const heading = useSelector((rootState: RootState) => rootState.heading.heading);
  const dispatch = useDispatch();
  useEffect(() => {
    if (ref.current && !map) {
      const m = new window.google.maps.Map(ref.current, { center, zoom, mapId });
      // google.maps.event.clearListeners(m, 'click');
      setMap(m);
    }
  }, [ref, map, center, zoom]);
  useEffect(() => {
    map?.setCenter(center);
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
            // map,
            index: markerIndex.current,
            position: latLng,
            createTime: Date.now(),
          }));
          markerIndex.current++;
        }
        e.stop();
      });
      return listener.remove;
    }
  }, [map]);

  return (
    <>
      <div id="map" ref={ref} />
      <Markers map={map} options={markers} />
      <Polyline map={map} path={markers.map(marker => marker.position)} />
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
