"use client";

import type { TimeSlot } from "@/types";

export function generateSlots(): string[] {
  const slots: string[] = [];
  for (let h = 7; h < 21; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedSlot: string | null;
  onSelect: (time: string) => void;
}

export default function TimeSlotGrid({ slots, selectedSlot, onSelect }: TimeSlotGridProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 gap-2">
      {slots.map((slot) => {
        const isSelected = selectedSlot === slot.time;
        const isAvailable = slot.available;

        return (
          <button
            key={slot.time}
            disabled={!isAvailable}
            onClick={() => isAvailable && onSelect(slot.time)}
            className={`
              rounded-md py-2 px-1 text-xs font-medium transition-all duration-150
              ${!isAvailable
                ? "bg-[#EBEBEB] text-[#BBBBBB] cursor-not-allowed line-through"
                : isSelected
                ? "bg-[#C8A456] text-[#0D0D0D] font-semibold shadow-md"
                : "bg-white text-[#555555] hover:bg-[#F5F5F5] hover:text-[#111111] cursor-pointer border border-[rgba(0,0,0,0.08)] hover:border-[rgba(200,164,86,0.4)]"
              }
            `}
          >
            {slot.time}
          </button>
        );
      })}
    </div>
  );
}
