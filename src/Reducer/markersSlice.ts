import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LatLng } from '../Map';

// import { LatLng } from '../Map';

// export type MarkerOption = google.maps.MarkerOptions & { createTime: number };

export interface MarkerOption {
  createTime: number;
  // map?: google.maps.Map;
  position: LatLng;
  index: number;
}

const initialState: MarkerOption[] = [];

export const markersSlice = createSlice({
  name: 'markers',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<MarkerOption>) => {
      state.push(action.payload);
    },
    deleteItem: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.splice(index, 1);
    },
    deleteAll: state => {
      state.length = 0;
    },
  },
});

export const { add, deleteItem, deleteAll } = markersSlice.actions;

export default markersSlice.reducer;
