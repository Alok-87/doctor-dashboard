import { createSlice } from '@reduxjs/toolkit';
import { StartCall  } from './videocallThunks';

export interface VideoCallState {
  loading: boolean;
  error: any | null;
}

const initialState: VideoCallState = {
  loading: false,
  error: null,
};

const walletSlice = createSlice({
  name: 'videocall',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder

      // startcall
      .addCase(StartCall.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(StartCall.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(StartCall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch wallet';
      })

  },
});

export const {} = walletSlice.actions;   
export default walletSlice.reducer;