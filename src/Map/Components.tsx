import React, { useRef, useEffect } from 'react';
import { LatLng } from '../Reducer/mapControlSlice';
import { MarkerOption } from '../Reducer/markersSlice';
import { useCompareEffect } from '../utils';

import nav from '/static/images/nav.png';
import cmp from '/static/images/cmp.png';

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

interface NavProps {
  size: number;
  mapSize: number;
}

export const Nav: React.FC<NavProps> = ({ size, mapSize }) => {
  const style: React.HTMLAttributes<HTMLImageElement>['style'] = {
    position: 'absolute',
    height: size,
    width: size,
    top: mapSize / 2,
    left: mapSize / 2,
    marginTop: -size / 2,
    marginLeft: -size / 2,
  };
  return <img id="nav-icon" alt="nav icon" style={style} src={nav} />;
};

interface CompassProps {
  heading: number;
  size: number;
  mapSize: number;
}

export const Compass: React.FC<CompassProps> = ({ heading, size, mapSize }) => {
  const style: React.HTMLAttributes<HTMLImageElement>['style'] = {
    position: 'absolute',
    height: size,
    width: size,
    top: mapSize / 5,
    left: mapSize * (4 / 5),
    marginTop: -size / 2,
    marginLeft: -size / 2,
    transform: `rotate(${-heading}deg)`,
  };
  return <img id="compass-icon" alt="compass icon" style={style} src={cmp} />;
};
