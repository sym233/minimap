import React, { useRef, useEffect } from 'react';
import { LatLng } from '../Reducer/mapControlSlice';
import { MarkerOption } from '../Reducer/markersSlice';
import { useCompareEffect } from '../utils';

/* global google */

interface MarkerProps {
  map?: google.maps.Map;
  option: MarkerOption;
  index: number;
}

export const Marker: React.FC<MarkerProps> = ({ map, option, index }) => {
  const marker = useRef<google.maps.Marker>();
  useEffect(() => {
    if (map) {
      marker.current = new window.google.maps.Marker({
        map,
        position: option.position,
        label: `${index}`,
      });
      return () => {
        marker.current?.setMap(null);
      };
    }
  }, [map]);
  useEffect(() => {
    marker.current?.setPosition(option.position);
  }, [option.position]);
  useEffect(() => {
    marker.current?.setLabel(`${index}`);
  }, [index]);
  return null;
};

interface MarkersProps {
  map?: google.maps.Map;
  options: MarkerOption[];
}

export const Markers: React.FC<MarkersProps> = ({ map, options }) => {
  if (map) {
    return (
      <>
        {options.map((option, index) => (
          <Marker key={option.createTime} index={index} map={map} option={option} />
        ))}
      </>
    );
  }
  return null;
};

interface PolylineProps {
  map?: google.maps.Map;
  path: LatLng[];
}

export const Polyline: React.FC<PolylineProps> = ({ map, path }) => {
  const polyline = useRef<google.maps.Polyline>();
  useEffect(() => {
    if (map) {
      polyline.current = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map,
      });
      return () => polyline.current!.setMap(null);
    }
  }, [map]);
  useCompareEffect(
    () => {
      polyline.current?.setPath(path);
    },
    path,
    (oldPath, newPath) => oldPath.length !== newPath.length
      || oldPath.some((val, i) => val !== newPath[i]),
  );
  return null;
};
