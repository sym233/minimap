import { configureStore } from '@reduxjs/toolkit';

import mapControlSlice from './Reducer/mapControlSlice';
import markersSlice from './Reducer/markersSlice';

export const store = configureStore({
  reducer: {
    mapControl: mapControlSlice,
    markers: markersSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
