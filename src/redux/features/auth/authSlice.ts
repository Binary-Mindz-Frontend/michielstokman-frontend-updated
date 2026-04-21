import { RootState } from '@/redux/store';
import { TLoginUser } from '@/types/userRole.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: TLoginUser | null;
  isAuthenticated: boolean;
  isSessionExpired: boolean;
  isAuthChecked: boolean; // 🔥 add this
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isSessionExpired: false,
  isAuthChecked: false, // 🔥 initially false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: TLoginUser | null }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = !!action.payload.user;
      state.isSessionExpired = false;
      state.isAuthChecked = true; // 🔥 important
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isSessionExpired = false;
      state.isAuthChecked = true; // 🔥 auth checked done
    },

    setSessionExpired: (state, action: PayloadAction<boolean>) => {
      state.isSessionExpired = action.payload;
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthChecked = true; // 🔥
    },
  },
});

export const { setAuth, logout, setSessionExpired } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const useCurrentUser = (state: RootState) => state.auth.user;
export const useIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const useAuthState = (state: RootState) => state.auth;
