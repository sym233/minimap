import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Heading {
  heading: number;
}

const initialState: Heading = {
  heading: 0,
};

export const headingSlice = createSlice({
  name: 'heading',
  initialState,
  reducers: {
    left: state => {
      state.heading -= 10;
    },
    right: state => {
      state.heading += 10;
    },
  },
});

// Action creators are generated for each case reducer function
export const { left, right } = headingSlice.actions;

export default headingSlice.reducer;
