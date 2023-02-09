import {
  observable,
  makeAutoObservable,
} from 'mobx';

/* global google */
export type LatLng = google.maps.LatLngLiteral;

const initLatLng = {
  lat: 30,
  lng: -110,
} as LatLng;

export const mapStatus = observable({
  latLng: initLatLng,
  zoom: 10,
  heading: 0,
  // running: false,
});

export type MapStatus = typeof mapStatus;

export const currentCenter = observable({ ...initLatLng });

export const runningStatus = observable({
  running: false,
  currentIndex: 0,
  runStartTime: 0,
});

export interface TimelineItem {
  createTime: number;
  arrivalTime: number;
  position: LatLng;
  zoom: number;
  waitUntil?: number;
}

type InsertOption =
  | 'append'
  | {
      insertBefore: number;
    };

export class Timeline {
  insertOption = 'append' as InsertOption;

  timelineItems = [] as TimelineItem[];

  showMarkers = true;

  constructor() {
    makeAutoObservable(this);
  }

  insertTimeline(item: TimelineItem) {
    const { insertOption, timelineItems } = this;
    if (insertOption === 'append') {
      timelineItems.push(item);
    } else {
      timelineItems.splice(insertOption.insertBefore, 0, item);
    }
  }

  deleteItem(index: number) {
    this.timelineItems.splice(index, 1);
  }

  deleteAll() {
    this.timelineItems.length = 0;
  }

  setAppend() {
    this.insertOption = 'append';
  }

  setInsertBefore(insertBefore: number) {
    this.insertOption = { insertBefore };
  }

  setArrivalTime(index: number, time: number) {
    this.timelineItems[index].arrivalTime = time;
  }

  setWaitUntil(index: number, time?: number) {
    this.timelineItems[index].waitUntil = time;
  }

  setZoom(index: number, zoom: number) {
    this.timelineItems[index].zoom = zoom;
  }

  saveTimeline() {
    localStorage.setItem('timeline', JSON.stringify(this.timelineItems));
  }

  loadTimeline() {
    const s = localStorage.getItem('timeline');
    if (!s) {
      return;
    }
    let obj: TimelineItem[];
    try {
      obj = JSON.parse(s);
    } catch (_) {
      return;
    }
    this.timelineItems = obj;
  }

  setShow(show: boolean) {
    this.showMarkers = show;
  }
}

export const timeline = new Timeline();
