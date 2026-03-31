export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  phone: string;
  isPhoneVerified: boolean;
  registrationNumber: string;
  degree: string;
  signatureImageUrl: string;
  profileImageUrl: string;
  status: string;
}

export interface Address {
  state: string;
  district: string;
  pincode: string;
  street: string;
  locality: string;
  lat?:number;
  lng?:number;
}

export interface UpdateProfilePayload {
  fullName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string;
  biography: string;
  experience: number;
  consultationFee: number;

  clinicName: string;
  clinicAddress: string;
  clinicCity: string;
  clinicPincode: string;

  addressLine1: string;
  city: string;
  postalCode: string;

  specializations: string[]; // IDs
  services: string[];        // IDs
  symptoms: string[];        // IDs

  profileImage?: string;
  timeTable :[];
}

export interface BookingResponse {
  count: number;
  bookings: Booking[];
}

export interface Booking {
  _id: string;
  visitor: string;
  bookingType: "venue" | string;
  party: string;

  partySnapshot: PartySnapshot;

  venue: Venue;

  amount: number;
  status: "paid" | "pending" | "failed";
  isUsed: boolean;
  checkedIn: boolean;

  qrToken?: string;
  qrCode?: string;

  validFrom?: string;
  validTill?: string;

  createdAt: string;
  updatedAt: string;
  quotationStatus: string;
}

export interface PartySnapshot {
  title: string;
  partyDate: string; // ISO date
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  price: number;
}

export interface Venue {
  _id: string;
  fullName: string;
  email: string;
  role: "venue";
  phone: string;

  isPhoneVerified: boolean;

  address: Address;

  profileImage: string;
  description: string;

  createdAt: string;
  updatedAt: string;
}


