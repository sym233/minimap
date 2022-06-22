import React, {
  useCallback,
  useEffect, useMemo, useRef, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LatLng, setCenter, setHeading } from './Reducer/mapControlSlice';
import { RootState } from './store';
// import { useEffectInterval } from './utils';

const fps = 30;
const Run = () => {
  const markers = useSelector((rootState: RootState) => rootState.markers);
  const lastTime = useRef<number>();
  const [runningIndex, setRunningIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const dispatch = useDispatch();
  const dispatchCenter = useCallback(
    (newLatLng: LatLng) => dispatch(setCenter(newLatLng)),
    [dispatch],
  );
  const dispatchHeading = useCallback(
    (heading: number) => dispatch(setHeading(heading)),
    [dispatch],
  );

  const [moveByPrecent, setMapHeading] = useMemo(() => {
    if (runningIndex + 1 < markers.markers.length) {
      const start = markers.markers[runningIndex].position;
      const end = markers.markers[runningIndex + 1].position;
      const dlat = end.lat - start.lat;
      const dlng = end.lng - start.lng;
      const heading = 90 - Math.atan2(dlat, dlng) / (Math.PI / 180);
      return [(percent: number) => dispatchCenter({
        lat: (1 - percent) * start.lat + percent * end.lat,
        lng: (1 - percent) * start.lng + percent * end.lng,
      }), () => {
        if (dlat !== 0 || dlng !== 0) {
          dispatchHeading(heading);
        }
      }];
    }
    return [undefined, undefined];
  }, [runningIndex, markers, dispatchCenter, dispatchHeading]);

  useEffect(() => {
    if (running) {
      dispatchCenter(markers.markers[0].position);
      setMapHeading?.();
      const interval = setInterval(() => {
        if (runningIndex + 1 < markers.markers.length && lastTime.current) {
          const now = Date.now();
          const timeInterval = (markers.markers[runningIndex + 1].time
           - markers.markers[runningIndex].time) * 1000;
          const percent = (now - lastTime.current) / timeInterval;
          if (percent >= 1) {
            setRunningIndex(i => i + 1);
            lastTime.current = now;
          } else if (percent >= 0) {
            moveByPrecent!(percent);
          }
        } else {
          setRunning(false);
          dispatchHeading(0);
          setRunningIndex(0);
          lastTime.current = undefined;
        }
      }, 1000 / fps);
      return () => clearInterval(interval);
    }
  }, [running, markers, moveByPrecent, setMapHeading, runningIndex]);
  // useEffectInterval(now => {
  //   if (running) {
  //     if (runningIndex + 1 < markers.markers.length && lastTime.current) {
  //       const timeInterval = (markers.markers[runningIndex + 1].time
  //         - markers.markers[runningIndex].time) * 1000;
  //       const percent = (now - lastTime.current) / timeInterval;
  //       if (percent >= 1) {
  //         setRunningIndex(i => i + 1);
  //         lastTime.current = now;
  //       } else if (percent >= 0) {
  //         moveByPrecent!(percent);
  //       }
  //     }
  //   }
  // }, 1000 / fps, [running, markers, moveByPrecent, setMapHeading, runningIndex]);
  const startRunning = () => {
    setRunning(true);
    setRunningIndex(0);
    setMapHeading?.();
    lastTime.current = Date.now() + 1000;
  };
  const stopRunning = () => {
    setRunning(false);
    dispatchHeading(0);
    setRunningIndex(0);
    lastTime.current = undefined;
  };

  return (running
    ? <button onClick={stopRunning}>Stop</button>
    : <button onClick={startRunning}>Run</button>);
};

export default Run;
