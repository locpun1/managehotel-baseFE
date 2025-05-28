import { RootState } from '@/store';
import { UserProfile } from '@/types/users';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface ResponseError {
  message: string | null;
  [key: string]: any;
}

interface UserState {
  profile: UserProfile | null;
}

const initialState: UserState = {
  profile: null,
};

const userSlice = createSlice({
  name: '@user',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<UserState['profile']>) {
      state.profile = action.payload || null;
    },
  },
});

export const { setProfile } = userSlice.actions;
export const selectUserProfile = (state: RootState) => state.user.profile;

export default userSlice.reducer;
