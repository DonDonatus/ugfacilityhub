"use client";

import { useEffect, useState, use } from "react";
import { getFacility, getAvailability } from "@/lib/api";
import TimeSlotGrid, { generateSlots } from "@/components/TimeSlotGrid";
import BookingModal from "@/components/BookingModal";
import Skeleton from "@/components/Skeleton";
import type { Facility, TimeSlot, Booking } from "@/types";

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function buildSlots(bookings: Booking[]): TimeSlot[] {
  const allTimes = generateSlots();
  // Normalize "HH:MM:SS" → "HH:MM" to match slot keys
  const bookedTimes = new Set(bookings.map((b) => b.startTime?.slice(0, 5)));
  return allTimes.map((time) => ({
    time,
    available: !bookedTimes.has(time),
    booking: bookings.find((b) => b.startTime?.slice(0, 5) === time),
  }));
}

export default function FacilityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [facility, setFacility] = useState<Facility | null>(null);
  const [facilityLoading, setFacilityLoading] = useState(true);
  const [facilityError, setFacilityError] = useState(false);

  const [date, setDate] = useState(todayISO());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Load facility details
  useEffect(() => {
    setFacilityLoading(true);
    setFacilityError(false);
    getFacility(id)
      .then(setFacility)
      .catch(() => setFacilityError(true))
      .finally(() => setFacilityLoading(false));
  }, [id]);

  // Load availability whenever date or id changes
  function loadSlots() {
    setSlotsLoading(true);
    getAvailability(id, date)
      .then((bookings) => setSlots(buildSlots(bookings)))
      .catch(() => setSlots(buildSlots([]))) // show all as available on error
      .finally(() => setSlotsLoading(false));
  }

  useEffect(() => {
    loadSlots();
  }, [id, date]);

  function handleSlotSelect(time: string) {
    setSelectedSlot(time);
    setShowModal(true);
  }

  function handleModalClose() {
    setShowModal(false);
    setSelectedSlot(null);
  }

  function handleBookingSuccess() {
    loadSlots();
  }

  if (facilityLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Skeleton className="h-4 w-24 mb-6" />
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-40 mb-1" />
        <Skeleton className="h-4 w-32 mb-10" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (facilityError || !facility) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <p className="text-[#555555] mb-4">Facility not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Facility header */}
      <div className="mb-10">
        <p className="text-[#C8A456] text-xs font-medium uppercase tracking-widest mb-2">
          {facility.location}
        </p>
        <h1 className="text-[#111111] text-3xl font-bold mb-2">{facility.name}</h1>
        {facility.description && (
          <p className="text-[#555555] text-sm max-w-xl">{facility.description}</p>
        )}
        <div className="mt-4 flex gap-4">
          <span className="bg-[rgba(200,164,86,0.1)] text-[#C8A456] text-xs font-medium px-3 py-1 rounded-full">
            Capacity: {facility.capacity}
          </span>
          <span className="bg-[#F0F0F0] text-[#555555] text-xs font-medium px-3 py-1 rounded-full">
            {facility.location}
          </span>
        </div>
      </div>

      {/* Availability section */}
      <div className="bg-white border border-[rgba(0,0,0,0.08)] rounded-2xl p-6">
        {/* Section header + date picker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[#111111] font-semibold text-lg">Available Slots</h2>
            <p className="text-[#888888] text-xs mt-0.5">30-minute intervals · 07:00 – 21:00</p>
          </div>
          <input
            type="date"
            value={date}
            min={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            className="bg-[#F5F5F5] border border-[rgba(0,0,0,0.08)] rounded-lg px-4 h-10 text-[#111111] text-sm outline-none focus:border-[#C8A456] transition-colors"
          />
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-5 text-xs text-[#888888]">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-white border border-[rgba(0,0,0,0.08)]" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#EBEBEB]" />
            Booked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#C8A456]" />
            Selected
          </span>
        </div>

        {/* Slot grid */}
        {slotsLoading ? (
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 gap-2">
            {[...Array(28)].map((_, i) => (
              <div key={i} className="shimmer h-9 rounded-md" />
            ))}
          </div>
        ) : (
          <TimeSlotGrid
            slots={slots}
            selectedSlot={selectedSlot}
            onSelect={handleSlotSelect}
          />
        )}
      </div>

      {/* Booking modal */}
      {showModal && selectedSlot && (
        <BookingModal
          facility={facility}
          date={date}
          startTime={selectedSlot}
          onClose={handleModalClose}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}
