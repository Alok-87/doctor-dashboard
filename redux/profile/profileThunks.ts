import { createAsyncThunk } from "@reduxjs/toolkit";
import { Booking, UpdateProfilePayload, User } from "./types";
import api from "../../api/axios";
// import toast from "react-hot-toast";


export const getDashboard = createAsyncThunk( 
  // return type
  // argument type
  "profile/dashboard",
  async (__, { rejectWithValue }) => {
    try {
      const response = await api.get("/doctors/dashboard");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "failed");
    }
  },
);

export const getProfile = createAsyncThunk<User>( // return type
  // argument type
  "profile/me",
  async (__, { rejectWithValue }) => {
    try {
      const response = await api.get("/doctors/profile");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "failed");
    }
  },
);

export const updateProfile = createAsyncThunk<
  User, // return type
  UpdateProfilePayload // argument type
>("profile/update", async (data, { rejectWithValue }) => {
  try {
    const response = await api.patch("/doctors/profile", data);
    // toast.success('profile update Successfully');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "update failed");
  }
});

export const fetchAppointments = createAsyncThunk(
  "profile/fetchappointment",
  async (
    { status, page, limit }: { status: string; page: number; limit: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.get(
        `/doctors/profile/appointments?status=${status}&page=${page}&limit=${limit}`,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const fetchAppointmentDetail = createAsyncThunk<
  any,
  string
>(
  "profile/fetchappointmentDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/doctors/appointments/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const updateAppointmentStatus = createAsyncThunk<
  any,
  { appointmentId: string; status: string }
>(
  "profile/updateAppointmentStatus",
  async (
    { appointmentId, status }: { appointmentId: string; status: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.patch(`/doctors/appointments/${appointmentId}/status`, { status },);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

