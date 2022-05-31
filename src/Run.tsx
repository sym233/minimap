import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LatLng } from './Map';
import { set } from './Reducer/lagLngSlice';
import { RootState } from './store';

// const speed = 2e-4;
const timeInterval = 2e3;
const fps = 30;
// const R = 6371000; // radius of earth in m

const Run = () => {
  // const latLng = useSelector((rootState: RootState) => rootState.latLng);
  const markers = useSelector((rootState: RootState) => rootState.markers);
  const lastTime = useRef<number>();
  // const [progress, setProgress] = useState(0);
  const [runningIndex, setRunningIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const dispatch = useDispatch();
  const moveto = (newLatLng: LatLng) => dispatch(set(newLatLng));

  const moveByPrecent = useMemo(() => {
    if (runningIndex + 1 < markers.length) {
      const start = markers[runningIndex].position;
      const end = markers[runningIndex + 1].position;
      return (percent: number) => moveto({
        lat: (1 - percent) * start.lat + percent * end.lat,
        lng: (1 - percent) * start.lng + percent * end.lng,
      });
    }
  }, [runningIndex, markers]);

  useEffect(() => {
    if (running) {
      const interval = setInterval(() => {
        if (runningIndex + 1 < markers.length && lastTime.current) {
          const now = Date.now();
          const percent = (now - lastTime.current) / timeInterval;
          if (percent >= 1) {
            setRunningIndex(i => i + 1);
            lastTime.current = now;
          } else {
            moveByPrecent!(percent);
          }
        } else {
          setRunning(false);
          setRunningIndex(0);
          lastTime.current = undefined;
        }
      }, 1 / fps);
      return () => clearInterval(interval);
    }
  }, [running, markers, moveByPrecent, runningIndex]);

  return <button onClick={() => { setRunning(r => !r); lastTime.current = Date.now(); }}>{running ? 'Stop' : 'Run'}</button>;
};

export default Run;
