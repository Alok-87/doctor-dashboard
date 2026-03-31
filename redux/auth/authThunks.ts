import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginPayload, User ,VerifyOtpPayload} from "./types";
import api from "../../api/axios";
import axios from "axios";



export const sendOtp = createAsyncThunk<
  "", // return type
  LoginPayload // argument type
>(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/otp-request', data)
      return response.data;
    } catch (error: any) {
      // toast.error("Invalid Credentials");
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      )
    }
  }
)

export const verifyOtp = createAsyncThunk<
  User,          // return type
  VerifyOtpPayload // argument type
>(
  'auth/verifyOtp',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/otp-verify', { ...data, role: 'DOCTOR' })
      localStorage.setItem("access_token", response.data.data.access_token)
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'OTP verification failed'
      )
    }
  }
)

export const fetchUserFromToken = createAsyncThunk<
  User,
  void
>(
  'auth/fetchUserFromToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await api.get('/doctors/profile');
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching user:', error);
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch user');
      }
      return rejectWithValue(error.message || 'Network error');
    }
  }
);