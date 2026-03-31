import { createSlice } from '@reduxjs/toolkit'
import {  sendOtp, verifyOtp, fetchUserFromToken } from './authThunks'
import type { User } from './types'

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  mobileOtpSent:boolean;
  mobileOtpVerify:boolean;
  mobileNumber: string;
  isAuthCheckComplete: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  mobileOtpSent:false,
  mobileOtpVerify:false,
  mobileNumber: "",
  isAuthCheckComplete: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
     setMobileOtpSent: (state, action) => {
      state.mobileOtpSent = action.payload;
    },
    setMobileOtpVerify: (state, action) => {
      state.mobileOtpVerify = action.payload;
    },
    setMobileNumber: (state, action) => {
      state.mobileNumber = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.mobileOtpSent = false;
      state.mobileOtpVerify = false;
      state.isAuthCheckComplete = true;
      localStorage.removeItem('access_token');
    },
    authCheckCompleted: (state) => {
      state.isAuthCheckComplete = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false
        state.mobileOtpSent = true
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

       .addCase(verifyOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false
        state.mobileOtpSent = true
        state.user = action.payload as any
        state.isAuthCheckComplete = true
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchUserFromToken.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAuthCheckComplete = false;
      })
      .addCase(fetchUserFromToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        state.isAuthCheckComplete = true;
      })
      .addCase(fetchUserFromToken.rejected, (state, action) => {
        state.loading = false;
        const errorMessage = action.payload as string;
        if (errorMessage !== 'No authentication token found') {
          state.error = errorMessage;
        } else {
          state.error = null;
        }
        state.user = null;
        state.isAuthCheckComplete = true;
        localStorage.removeItem('access_token');
      })
  },
})

export const {setMobileOtpSent,setMobileOtpVerify,setMobileNumber,logout,authCheckCompleted} = authSlice.actions
export default authSlice.reducer
