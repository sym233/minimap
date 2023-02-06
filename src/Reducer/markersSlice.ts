/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LatLng } from './mapControlSlice';

export interface MarkerOption {
  createTime: number;
  time: number;
  position: LatLng;
  zoom: number;
  // wait: number;
}

interface MarkersState {
  show: boolean;
  insertOption: 'append' | { insertBefore: number };
  markers: MarkerOption[];
}

const initialState: MarkersState = {
  show: true,
  insertOption: 'append',
  markers: [],
};

export const markersSlice = createSlice({
  name: 'markers',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<MarkerOption>) => {
      if (state.insertOption === 'append') {
        state.markers.push(action.payload);
      } else if (typeof state.insertOption.insertBefore === 'number') {
        state.markers.splice(state.insertOption.insertBefore, 0, action.payload);
      }
    },
    deleteItem: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.markers.splice(index, 1);
    },
    deleteAll: state => {
      state.markers.length = 0;
    },
    setAppend: state => {
      state.insertOption = 'append';
    },
    setInsertBefore: (state, action: PayloadAction<number>) => {
      state.insertOption = {
        insertBefore: action.payload,
      };
    },
    setTime: (state, action: PayloadAction<{index: number, time: number}>) => {
      state.markers[action.payload.index].time = action.payload.time;
    },
    // setWait: (state, action: PayloadAction<{index: number, wait: number}>) => {
    //   state.markers[action.payload.index].wait = action.payload.wait;
    // },
    setZoom: (state, action: PayloadAction<{index: number, zoom: number}>) => {
      state.markers[action.payload.index].zoom = action.payload.zoom;
    },
    loadMarkers: (state, action: PayloadAction<MarkerOption[]>) => {
      state.markers = action.payload;
    },
    setMarkersDisplay: (state, action: PayloadAction<boolean>) => {
      state.show = action.payload;
    },
  },
});

export const {
  add, deleteItem, deleteAll, loadMarkers, setAppend, setInsertBefore,
  setTime, setMarkersDisplay, /* setWait, */ setZoom,
} = markersSlice.actions;

export default markersSlice.reducer;
