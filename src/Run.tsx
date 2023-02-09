import React from 'react';
import { action, reaction, runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';

import {
  LatLng, mapStatus, runningStatus, timeline,
} from './store';

const fps = 30;

const timerRef = {
  current: undefined as (number | undefined),
};

const resetRunning = action(() => {
  Object.assign(runningStatus, {
    runStartTime: 0,
    currentIndex: 0,
    running: false,
  });
  mapStatus.heading = 0;
});

const startRunning = action(() => {
  runningStatus.running = true;
});

const stopRunning = action(() => {
  runningStatus.running = false;
  resetRunning();
});

const toNextPoint = action(() => {
  if (runningStatus.currentIndex + 1 >= timeline.timelineItems.length) {
    setTimeout(() => {
      resetRunning();
    }, 1000);
    clearInterval(timerRef.current);
  } else {
    runningStatus.currentIndex++;
  }
});

const setHeading = (position: LatLng, nextPosition: LatLng) => {
  const dlat = nextPosition.lat - position.lat;
  const dlng = nextPosition.lng - position.lng;
  if (dlat !== 0 && dlng !== 0) {
    const heading = 90 - Math.atan2(dlat, dlng) / (Math.PI / 180);
    runInAction(() => {
      mapStatus.heading = heading;
    });
  }
};

function run() {
  timerRef.current = setInterval(() => {
    const { currentIndex, runStartTime } = runningStatus;
    const currentTime = Date.now() - runStartTime;
    if (currentIndex > 0) {
      const prevPosition = timeline.timelineItems[currentIndex - 1];
      const dest = timeline.timelineItems[currentIndex];
      const startTime = (prevPosition.waitUntil ?? prevPosition.arrivalTime) * 1000;
      const endTime = dest.arrivalTime * 1000;
      setHeading(prevPosition.position, dest.position);
      if (currentTime <= startTime) {
        runInAction(() => {
          mapStatus.latLng = prevPosition.position;
        });
      } else if (currentTime < endTime) {
        const precent = (currentTime - startTime) / (endTime - startTime);
        const lat = (1 - precent) * prevPosition.position.lat + precent * dest.position.lat;
        const lng = (1 - precent) * prevPosition.position.lng + precent * dest.position.lng;
        runInAction(() => {
          mapStatus.latLng = { lat, lng };
        });
      } else {
        runInAction(() => {
          mapStatus.latLng = dest.position;
        });
        toNextPoint();
      }
    } else {
      // first marker
      const dest = timeline.timelineItems[currentIndex];
      const endTime = (dest.waitUntil ?? dest.arrivalTime) * 1000;
      if (currentTime <= endTime) {
        const next = timeline.timelineItems[currentIndex + 1];
        runInAction(() => {
          mapStatus.latLng = dest.position;
          if (next) {
            setHeading(dest.position, next.position);
          }
        });
      } else {
        toNextPoint();
      }
    }
  }, 1000 / fps);
}

reaction(
  () => runningStatus.running,
  r => {
    if (r) {
      runInAction(() => {
        runningStatus.runStartTime = Date.now() + 1000;
        run();
      });
    } else {
      resetRunning();
      clearInterval(timerRef.current);
    }
  },
);

const Run = observer(() => {
  const { running } = runningStatus;
  return (running
    ? <button type="button" onClick={stopRunning}>Stop</button>
    : <button type="button" onClick={startRunning}>Run</button>);
});

export default Run;
