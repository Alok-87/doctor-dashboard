import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Booking, User } from "./types";
import {
  fetchAppointmentDetail,
  fetchAppointments,
  getDashboard,
  getProfile,
  updateAppointmentStatus,
  updateProfile,
} from "./profileThunks";

export interface ProfileState {
  user: User | null;
  loading: boolean;
  error: string | null;
  appointments: [];
  meta: any | null;
  appointment: any | null;
  dashboard: any | null;
}

const initialState: ProfileState = {
  user: null,
  loading: false,
  error: null,
  appointments: [],
  meta: null,
  appointment: null,
  dashboard: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
        // state.appointments = action.payload.appointments;
        // state.meta = action.payload.meta;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAppointmentDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.appointment = action.payload;
        // state.appointments = action.payload.appointments;
        // state.meta = action.payload.meta;
      })
      .addCase(fetchAppointmentDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAppointmentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateAppointmentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(getDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {} = profileSlice.actions;
export default profileSlice.reducer;
