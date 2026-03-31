export interface DashboardStats {
  pending?: number;
  completed?: number;
  cancelled?: number;
  noShow?: number;
  totalRevenue?: string;
  platformCommission?: string;
  netEarnings?: string;
  walletBalance?: string;
}

export interface AppointmentGraphItem {
  month: string;
  count: number;
}

export interface LatestAppointment {
  id: string;
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  total_amount: string;
  consultation_type: string;
}