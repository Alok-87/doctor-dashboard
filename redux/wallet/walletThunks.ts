import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const getWallet = createAsyncThunk(
  "wallet/getWallet",
  async (
    { page, limit }: {  page: number; limit: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.get( `/doctors/wallet?page=${page}&limit=${limit}`,);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

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

export const payoutReq = createAsyncThunk(
  "wallet/payout",
  async (payload,{ rejectWithValue },
  ) => {
    try {
      const response = await api.post( '/doctors/payouts',payload);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

