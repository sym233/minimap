import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LatLng } from '../Map';

const initialState: LatLng = {
  lat: 30,
  lng: -110,
};

export const latLngSlice = createSlice({
  name: 'latLng',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<LatLng>) => {
      Object.assign(state, action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { set } = latLngSlice.actions;

export default latLngSlice.reducer;
