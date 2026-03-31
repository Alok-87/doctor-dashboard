import { createSlice } from '@reduxjs/toolkit';
import { getLedger, getWallet, payoutReq } from './walletThunks';

export interface WalletState {
  wallet:   any  | null;
  ledger: any | null;
  loading: boolean;
  error: any | null;
}

const initialState: WalletState = {
  wallet: null,
  ledger: null,
  loading: false,
  error: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    resetWalletError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // getWallet
      .addCase(getWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.wallet = action.payload
      })
      .addCase(getWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch wallet';
      })
      // getLedger
      .addCase(getLedger.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLedger.fulfilled, (state, action) => {
        state.loading = false;
        state.ledger = action.payload
      })
      .addCase(getLedger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch wallet';
      })
       .addCase(payoutReq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payoutReq.fulfilled, (state, action) => {
        state.loading = false;
        state.ledger = action.payload
      })
      .addCase(payoutReq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch wallet';
      })

  },
});

export const { resetWalletError} = walletSlice.actions;   
export default walletSlice.reducer;