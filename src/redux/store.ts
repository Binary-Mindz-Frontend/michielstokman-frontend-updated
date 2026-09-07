/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore } from '@reduxjs/toolkit';
import { apiClient } from './apiClient/apiClient';
import publicationsDraftReducer from './features/admin/publications/publicationsDraft.slice';
import authReducer from './features/auth/authSlice';

export const makeStore = (user: any = null) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      publicationsDraft: publicationsDraftReducer,
      [apiClient.reducerPath]: apiClient.reducer,
    },
    preloadedState: {
      auth: {
        user: user,
        isAuthenticated: !!user,
        isSessionExpired: false,
        isAuthChecked: true,
      },
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiClient.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
