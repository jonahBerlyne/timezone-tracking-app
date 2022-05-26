import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './Store';

export interface UserState {
  user: any;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: UserState = {
  user: null,
  status: 'idle',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  }
});

export const selectUser = ((state: RootState) => state.user.user);

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;