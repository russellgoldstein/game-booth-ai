import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import toastReducer from './toastSlice';
import userReducer from './userSlice';

const storeOptions: ConfigureStoreOptions = {
  reducer: {
    toast: toastReducer,
    user: userReducer,
  },
};

export const store = configureStore(storeOptions);

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
