"use client";

import { useEffect, useState } from "react";
import { getBookings, cancelBooking } from "@/lib/api";
import { BookingRowSkeleton } from "@/components/Skeleton";
import { useToast } from "@/components/ToastContext";
import type { Booking } from "@/types";
import Link from "next/link";

type Filter = "all" | "confirmed" | "pending" | "cancelled";

const statusStyles: Record<string, string> = {
  CONFIRMED: "bg-[rgba(200,164,86,0.12)] text-[#C8A456]",
  PENDING: "bg-[rgba(243,156,18,0.12)] text-[#F39C12]",
  CANCELLED: "bg-[rgba(231,76,60,0.12)] text-[#E74C3C]",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const { showToast } = useToast();

  function load() {
    setLoading(true);
    setError(false);
    getBookings()
      .then((bookings) => {
        setBookings(bookings);
        console.log("[BookingsPage] Loaded bookings:", bookings);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleCancel(id: number) {
    try {
      await cancelBooking(id);
      showToast("Booking cancelled.", "success");
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b))
      );
    } catch {
      showToast("Could not cancel. Please try again.", "error");
    }
  }

  const filters: Filter[] = ["all", "confirmed", "pending", "cancelled"];
  const visible =
    filter === "all" ? bookings : bookings.filter((b) => b.status.toLowerCase() === filter);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[#C8A456] text-xs font-medium uppercase tracking-widest mb-1">
          Overview
        </p>
        <h1 className="text-[#111111] text-3xl font-bold">My Bookings</h1>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all duration-200 ${
              filter === f
                ? "bg-[#C8A456] text-[#0D0D0D]"
                : "bg-[#F0F0F0] border border-[rgba(0,0,0,0.08)] text-[#555555] hover:text-[#111111]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-[rgba(0,0,0,0.08)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(0,0,0,0.08)]">
              {["Facility", "Date", "Time", "Status", "Actions"].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-[#666666] text-xs font-medium uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => <BookingRowSkeleton key={i} />)
            ) : error ? (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <p className="text-[#555555] mb-3">Could not load bookings.</p>
                  <button
                    onClick={load}
                    className="text-xs text-[#C8A456] hover:text-[#A07828] transition-colors"
                  >
                    Retry
                  </button>
                </td>
              </tr>
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16">
                  <p className="text-[#666666] text-sm mb-4">No bookings found.</p>
                  <Link
                    href="/facilities"
                    className="text-xs text-[#C8A456] hover:text-[#A07828] transition-colors"
                  >
                    Book a facility →
                  </Link>
                </td>
              </tr>
            ) : (
              visible.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-[rgba(0,0,0,0.05)] hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                >
                  <td className="px-4 py-3 text-[#111111] font-medium">
                    {b.facility?.name ?? "Unknown Facility"}
                  </td>
                  <td className="px-4 py-3 text-[#555555]">{b.date}</td>
                  <td className="px-4 py-3 text-[#555555]">
                    {b.startTime?.slice(0, 5)} &ndash; {b.endTime?.slice(0, 5)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        statusStyles[b.status] ?? "bg-[#F0F0F0] text-[#555555]"
                      }`}
                    >
                      {b.status.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {b.status !== "CANCELLED" && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="text-xs text-[#E74C3C] hover:text-red-400 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
