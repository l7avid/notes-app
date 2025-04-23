/* eslint-disable prettier/prettier */
import { configureStore } from '@reduxjs/toolkit';
import userAuth from './reducers/userAuth';

export const store = configureStore({
  reducer: {
    userData: userAuth,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
