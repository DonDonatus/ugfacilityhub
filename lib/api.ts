import axios from "axios";
import type { Facility, Booking } from "@/types";

// In Node.js (server components), relative URLs don't resolve — use the backend directly.
// In the browser, use the /api proxy so Next.js rewrites handle the destination.
const isServer = typeof window === "undefined";
const baseURL = isServer
  ? (process.env.BACKEND_URL ?? "https://facilitybooking-lkpk.onrender.com")
  : "/api";

const api = axios.create({ baseURL });

// Safely extract an array from a response — handles plain arrays and
// common envelope shapes like { data: [] }, { facilities: [] }, etc.
function toArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    for (const key of ["data", "facilities", "bookings", "results", "items"]) {
      const val = (data as Record<string, unknown>)[key];
      if (Array.isArray(val)) return val as T[];
    }
  }
  return [];
}

export async function getFacilities(): Promise<Facility[]> {
  const res = await api.get("/facilities");
  console.log("[api] GET /facilities:", res.data);
  return toArray<Facility>(res.data);
}

export async function getFacility(id: string | number): Promise<Facility> {
  const res = await api.get(`/facilities/${id}`);
  console.log(`[api] GET /facilities/${id}:`, res.data);
  return res.data;
}

export async function getBookings(): Promise<Booking[]> {
  const res = await api.get("/bookings");
  console.log("[api] GET /bookings:", res.data);
  return toArray<Booking>(res.data);
}

export async function createBooking(data: {
  user_id: number;
  facility_id: number;
  date: string;
  start_time: string;
  end_time: string;
}): Promise<Booking> {
  const res = await api.post("/bookings", data);
  console.log("[api] POST /bookings:", res.data);
  return res.data;
}

export async function updateBooking(
  id: string | number,
  data: { date?: string; start_time?: string; end_time?: string; status?: string }
): Promise<Booking> {
  const res = await api.put(`/bookings/${id}`, data);
  console.log(`[api] PUT /bookings/${id}:`, res.data);
  return res.data;
}

export async function cancelBooking(id: string | number): Promise<void> {
  await api.put(`/bookings/${id}`, { status: "CANCELLED" });
  console.log(`[api] PUT /bookings/${id} CANCELLED`);
}

export async function getAvailability(
  facilityId: string | number,
  date: string
): Promise<Booking[]> {
  const res = await api.get("/availability", {
    params: { facility_id: facilityId, date },
  });
  console.log("[api] GET /availability:", res.data);
  const data = res.data;
  // API returns { available: true } or { available: false, existing_bookings: [...] }
  if (data && typeof data === "object" && Array.isArray(data.existing_bookings)) {
    return data.existing_bookings as Booking[];
  }
  return [];
}
