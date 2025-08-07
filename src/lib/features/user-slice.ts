import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  userData: {
    id?: number;
    name: string;
    birthYear: number;
    nationality: string;
    healthyFood: boolean;
    running: boolean;
    alcohol: boolean;
    smoking: boolean;
  } | null;
}

// Define initial state without localStorage access
const initialState: UserState = {
  userData: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserState['userData']>) => {
      state.userData = action.payload;

      // Save to localStorage
      if (action.payload) {
        localStorage.setItem('lifeVisualizerUserData', JSON.stringify(action.payload));
      }
    },
  },
});

export const { setUserData } = userSlice.actions;
export const userReducer = userSlice.reducer;
