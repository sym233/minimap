/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LatLng } from '../Map';

interface InitialState {
  latLng: LatLng;
  heading: number;
}

const initialState: InitialState = {
  latLng: {
    lat: 30,
    lng: -110,
  },

  heading: 0,
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
  },
});

// Action creators are generated for each case reducer function
export const {
  setCenter,
  moveCenterBy,
  setHeading,
  rotateHeadingBy,
} = mapControlSlice.actions;

export default mapControlSlice.reducer;
