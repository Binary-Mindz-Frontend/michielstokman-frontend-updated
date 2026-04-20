/* eslint-disable @typescript-eslint/no-explicit-any */
import { RootState } from '@/redux/store';
import { TLoginUser } from '@/types/userRole.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: TLoginUser | null;
  isAuthenticated: boolean;
  isSessionExpired: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isSessionExpired: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: any | null }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = !!action.payload.user;
      state.isSessionExpired = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isSessionExpired = false;
    },
    setSessionExpired: (state, action: PayloadAction<boolean>) => {
      state.isSessionExpired = action.payload;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuth, logout, setSessionExpired } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const useCurrentUser = (state: RootState) => state.auth.user;
export const useIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
