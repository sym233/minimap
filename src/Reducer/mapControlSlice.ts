/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/* global google */
export type LatLng = google.maps.LatLngLiteral;

interface MapControl {
  running: boolean;
  latLng: LatLng;
  heading: number;
  zoom: number;
}

const initialState: MapControl = {
  running: false,
  latLng: {
    lat: 30,
    lng: -110,
  },
  heading: 0,
  zoom: 10,
};

export const mapControlSlice = createSlice({
  name: 'mapControl',
  initialState,
  reducers: {
    setCenter: (state, action: PayloadAction<LatLng>) => {
      state.latLng = action.payload;
    },
    moveCenterBy: (state, action: PayloadAction<LatLng>) => {
      state.latLng.lat += action.payload.lat;
      state.latLng.lng += action.payload.lng;
    },
    setHeading: (state, action: PayloadAction<number>) => {
      state.heading = action.payload;
    },
    rotateHeadingBy: (state, action: PayloadAction<number>) => {
      state.heading += action.payload;
    },
    setRunning: (state, action: PayloadAction<boolean>) => {
      state.running = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setCenter,
  moveCenterBy,
  setHeading,
  rotateHeadingBy,
  setRunning,
  setZoom,
} = mapControlSlice.actions;

export default mapControlSlice.reducer;
