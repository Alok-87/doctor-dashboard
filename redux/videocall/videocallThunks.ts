import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";


export const getLedger = createAsyncThunk(
  "wallet/getLedger",
  async (
    { page, limit }: {  page: number; limit: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.get( `/doctors/ledger?page=${page}&limit=${limit}`,);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);


export const StartCall = createAsyncThunk<
  any, // ✅ return type
  string,            // ✅ argument type (APPOINTMENT_ID)
  { rejectValue: string } // ✅ error type
>(
  "videoCall/start",
  async (APPOINTMENT_ID, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/doctors/appointments/${APPOINTMENT_ID}/video/start`
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);