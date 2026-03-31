import { createSlice } from '@reduxjs/toolkit'
import { medicinSearch, uploadPrescriptionToAppointment } from './medicineThunks';
import { MedicineResponse } from './types';

export interface MedicineState {
  loading: boolean;
  error: string | null;
  mobileOtpSent: boolean;
  searchedMedicines: MedicineResponse[];
}

const initialState: MedicineState = {
  loading: false,
  error: null,
  mobileOtpSent: false,
  searchedMedicines: [],
}

const medicineSlice = createSlice({
  name: 'medicine',
  initialState,
  reducers: {
    setMobileOtpSent: (state, action) => {
      state.mobileOtpSent = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(medicinSearch.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(medicinSearch.fulfilled, (state, action) => {
        state.loading = false
        state.searchedMedicines = action.payload;
      })
      .addCase(medicinSearch.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(uploadPrescriptionToAppointment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(uploadPrescriptionToAppointment.fulfilled, (state, action) => {
        state.loading = false
        // state.searchedMedicines = action.payload; // ❌ FIXED: Should not overwrite search results
      })
      .addCase(uploadPrescriptionToAppointment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setMobileOtpSent } = medicineSlice.actions
export default medicineSlice.reducer
