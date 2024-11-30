import { createSlice } from '@reduxjs/toolkit';
import { getStorageData } from '../../../config/storage';
import { ACCESS_TOKEN } from '../../../constants/auth';

export interface AuthState {
  isAuth: boolean;
}

const checkAuth = (): boolean => Boolean(getStorageData(ACCESS_TOKEN));

const initialState: AuthState = {
  isAuth: checkAuth(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state) {
      state.isAuth = true;
    },
    logout(state) {
      state.isAuth = false;
    },
  },
});

const { reducer, actions } = authSlice;

export const { logout, login } = actions;

export default reducer;
