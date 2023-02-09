import React, {
  useState, useRef, useEffect, FC,
} from 'react';

import { Wrapper, Status } from '@googlemaps/react-wrapper';

import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';

import {
  currentCenter,
  mapStatus, runningStatus, timeline,
} from '../store';
import {
  Compass, Markers, Nav, Polyline,
} from './Components';

const apiKey = 'AIzaSyCF5RGzHDQiJgVTfpmszEHM1dXlEXx-B4g';
const mapId = 'e3d3436438fcc6d9';

const mapSize = 600;

/* global google */

const MapContent: FC = observer(() => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const {
    heading,
    latLng: center,
    zoom,
  } = mapStatus;
  const {
    running,
  } = runningStatus;
  const { timelineItems, showMarkers } = timeline;

  useEffect(() => {
    if (ref.current && !map) {
      const m = new window.google.maps.Map(ref.current, { center, zoom, mapId });
      setMap(m);
    }
  }, [map]);

  const { lat, lng } = center;
  useEffect(() => {
    map?.panTo({ lat, lng });
  }, [map, lat, lng]);
  useEffect(() => {
    map?.setZoom(zoom);
  }, [map, zoom]);
  useEffect(() => {
    map?.setHeading(heading);
  }, [map, heading]);
  useEffect(() => {
    map?.setOptions({ disableDefaultUI: running });
  }, [map, running]);
  useEffect(() => {
    const clickListener = map?.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng && showMarkers) {
        const position = e.latLng.toJSON();
        timeline.insertTimeline({
          position,
          createTime: Date.now(),
          arrivalTime: 0,
          zoom,
        });
      }
      e.stop();
    });
    const zoomListener = map?.addListener('zoom_changed', () => {
      const z = map.getZoom();
      if (z) {
        runInAction(() => {
          mapStatus.zoom = z;
        });
      }
    });
    const moveListener = map?.addListener('center_changed', () => {
      const mapCenter = map.getCenter()?.toJSON();
      if (mapCenter) {
        runInAction(() => {
          Object.assign(currentCenter, mapCenter);
        });
      }
    });
    return () => {
      clickListener?.remove();
      zoomListener?.remove();
      moveListener?.remove();
    };
  }, [map, showMarkers]);

  return (
    <>
      <div id="map" style={{ height: mapSize, width: mapSize }} ref={ref} />
      {running && <Nav size={20} mapSize={mapSize} />}
      <Compass size={50} mapSize={mapSize} heading={heading} />
      {showMarkers && (
        <>
          <Markers map={map} options={timelineItems} />
          <Polyline map={map} path={timelineItems.map(item => item.position)} />
        </>
      )}
    </>
  );
});

const render = (status: Status) => <h1>{status}</h1>;
const Map: FC = () => (
  <Wrapper apiKey={apiKey} render={render}>
    <MapContent />
  </Wrapper>
);

export default Map;
