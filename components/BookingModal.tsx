"use client";

import { useState } from "react";
import { createBooking } from "@/lib/api";
import { useToast } from "@/components/ToastContext";
import type { Facility } from "@/types";

interface BookingModalProps {
  facility: Facility;
  date: string;
  startTime: string;
  onClose: () => void;
  onSuccess: () => void;
}

function addThirtyMin(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + 30;
  const nh = Math.floor(total / 60);
  const nm = total % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}

export default function BookingModal({
  facility,
  date,
  startTime,
  onClose,
  onSuccess,
}: BookingModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const endTime = addThirtyMin(startTime);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await createBooking({
        user_id: 1,
        facility_id: facility.id,
        date,
        start_time: startTime,
        end_time: endTime,
      });
      showToast("Booking confirmed!", "success");
      onSuccess();
      onClose();
    } catch {
      showToast("Booking failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="mb-6">
          <p className="text-[#C8A456] text-xs font-medium uppercase tracking-widest mb-1">
            Confirm Booking
          </p>
          <h2 className="text-[#111111] text-xl font-bold">{facility.name}</h2>
          <p className="text-[#555555] text-sm mt-1">{facility.location}</p>
        </div>

        {/* Booking details */}
        <div className="bg-[#F5F5F5] rounded-xl p-4 mb-6 flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-[#888888] text-sm">Date</span>
            <span className="text-[#111111] text-sm font-medium">{date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#888888] text-sm">Time</span>
            <span className="text-[#111111] text-sm font-medium">
              {startTime} &ndash; {endTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#888888] text-sm">Capacity</span>
            <span className="text-[#111111] text-sm font-medium">{facility.capacity}</span>
          </div>
        </div>

        {/* Actions */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-lg border border-[rgba(0,0,0,0.12)] text-[#555555] text-sm font-medium hover:text-[#111111] hover:border-[rgba(0,0,0,0.2)] transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 h-11 rounded-lg bg-[#C8A456] text-[#0D0D0D] text-sm font-semibold hover:bg-[#A07828] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? "Confirming..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}
