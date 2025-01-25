import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { simApi } from '../services/simApi';

interface User {
  id: string;
  username: string;
  // Add other user properties as needed
}

interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
  },
});

export default userSlice.reducer;
