import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import axios from "axios";
import { MedicineResponse } from "./types";

export const medicinSearch = createAsyncThunk<
    MedicineResponse[],
    string,
    { rejectValue: string }
>(
    'medicine/medicinSearch',
    async (searchTerm: string, { rejectWithValue }) => {
        try {
            const response = await api.get<{
                message: string;
                data: { medicines: MedicineResponse[], total_count: number };
            }>(`/medicine?search_term=${searchTerm}`);
            return response.data.data.medicines;
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data.message || 'Failed to search medicines');
            }
            return rejectWithValue(error.message || 'Network error');
        }
    }
);

export const uploadDocument = createAsyncThunk<
  string, // return type (URL)
  { folder: string; file: File }, // payload type
  { rejectValue: string }
>(
  'doctoronboarding/upload',
  async (body, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('folder', body.folder);
      formData.append('file', body.file);
      const { data } = await api.post(
        '/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('upload', data);
      return data?.data?.url; // ✅ return only URL
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || 'Failed to upload prescription'
      );
    }
  }
);


export const uploadPrescriptionToAppointment = createAsyncThunk<
  any,
  { appointmentId: string; file_url: string },
  { rejectValue: string }
>(
  "appointment/uploadPrescription",
  async ({ appointmentId, file_url }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/doctors/appointments/${appointmentId}/upload`, { file_url });
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to upload prescription"
      );
    }
  }
);