export interface Facility {
  id: number;
  name: string;
  location: string;
  capacity: number;
  description?: string;
  image_url?: string;
}

export interface Booking {
  id: number;
  date: string;        // "YYYY-MM-DD"
  startTime: string;   // "HH:MM:SS" — slice to "HH:MM" for display
  endTime: string;     // "HH:MM:SS" — slice to "HH:MM" for display
  status: "CONFIRMED" | "PENDING" | "CANCELLED";
  facility?: {
    id: number;
    name: string;
    location: string;
    capacity: number;
  };
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
}

export interface TimeSlot {
  time: string;        // "HH:MM"
  available: boolean;
  booking?: Booking;
}
