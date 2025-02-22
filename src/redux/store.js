import {configureStore} from '@reduxjs/toolkit';
import userAuth from './reducers/userAuth';

const store = configureStore({
  reducer: {
    userData: userAuth,
  },
});
export default store;