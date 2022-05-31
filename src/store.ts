import { configureStore } from '@reduxjs/toolkit';

import headingSlice from './Reducer/headingSlice';
import latLngReducer from './Reducer/lagLngSlice';
import markersSlice from './Reducer/markersSlice';

export const store = configureStore({
  reducer: {
    latLng: latLngReducer,
    markers: markersSlice,
    heading: headingSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
