import Link from "next/link";
import type { Facility } from "@/types";

export default function FacilityCard({ facility }: { facility: Facility }) {
  return (
    <Link href={`/facilities/${facility.id}`} className="block group">
      <div className="bg-white border border-[rgba(0,0,0,0.08)] rounded-xl overflow-hidden hover:border-[rgba(200,164,86,0.4)] hover:scale-[1.01] transition-all duration-300">
        <div className="h-40 bg-[#F0F0F0] flex items-center justify-center">
          <span className="text-[#888888] text-xs tracking-widest uppercase">
            {facility.location}
          </span>
        </div>
        <div className="p-5">
          <h3 className="text-[#111111] font-semibold text-base group-hover:text-[#C8A456] transition-colors duration-200">
            {facility.name}
          </h3>
          <p className="text-[#555555] text-sm mt-1">{facility.location}</p>
          {facility.description && (
            <p className="text-[#888888] text-xs mt-2 line-clamp-2">{facility.description}</p>
          )}
          <div className="mt-4 flex items-center justify-between">
            <span className="bg-[rgba(200,164,86,0.1)] text-[#C8A456] text-xs font-medium px-3 py-1 rounded-full">
              Capacity: {facility.capacity}
            </span>
            <span className="text-[#C8A456] text-xs font-medium group-hover:translate-x-1 transition-transform duration-200">
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
