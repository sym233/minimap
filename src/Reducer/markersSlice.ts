/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LatLng } from './mapControlSlice';

export interface MarkerOption {
  createTime: number;
  time: number;
  position: LatLng;
}

interface MarkersState {
  insertOption: 'append' | { insertAfter: number };
  markers: MarkerOption[];
}

const initialState: MarkersState = {
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
      } else if (typeof state.insertOption.insertAfter === 'number') {
        state.markers.splice(state.insertOption.insertAfter, 0, action.payload);
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
    setInsertAfter: (state, action: PayloadAction<number>) => {
      state.insertOption = {
        insertAfter: action.payload,
      };
    },
    setTime: (state, action: PayloadAction<{index: number, time: number}>) => {
      state.markers[action.payload.index].time = action.payload.time;
    },
    loadMarkers: (state, action: PayloadAction<MarkerOption[]>) => {
      state.markers = action.payload;
    },
  },
});

export const {
  add, deleteItem, deleteAll, loadMarkers, setAppend, setInsertAfter, setTime,
} = markersSlice.actions;

export default markersSlice.reducer;
