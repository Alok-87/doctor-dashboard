export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  phone: string;
  isPhoneVerified: true;
  address: Address;
  profileImage: string;
}

export interface LoginPayload {
  phone_number: string;
  purpose: string;
}

export interface VerifyOtpPayload {
  phone_number: string;
  otp_code: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  address: Address;
  description?: string;
  profileImage?: File;
  price?: string;
}

export interface Address {
  state: string;
  district: string;
  pincode: string;
  street: string;
  locality: string;
  lat?: number;
  lng?: number;
}
export interface SignupResponse {
  fullName: string;
  email: string;
  password: string;
  role: "musician" | "visitor" | "restaurant";
  phone: string;
  address: Address;
}
