import Link from "next/link";
import FacilityCard from "@/components/FacilityCard";
import { getFacilities } from "@/lib/api";
import type { Facility } from "@/types";

export default async function Home() {
  let facilities: Facility[] = [];
  try {
    facilities = await getFacilities();
  } catch {
    // backend may not be running locally — graceful degradation
  }

  const preview = facilities.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Hero */}
      <section className="py-28 text-center">
        <p className="text-[#C8A456] text-xs font-medium uppercase tracking-[0.25em] mb-4">
          University of Ghana
        </p>
        <h1 className="text-5xl md:text-6xl font-bold text-[#111111] tracking-tight leading-tight mb-5">
          Book Campus
          <br />
          <span className="text-[#C8A456]">Facilities</span>
        </h1>
        <p className="text-[#555555] text-lg max-w-md mx-auto mb-10">
          Reserve rooms, courts, labs and lecture halls in seconds.
        </p>
        <Link
          href="/facilities"
          className="inline-block bg-[#C8A456] text-[#0D0D0D] font-semibold px-8 py-3 rounded-lg hover:bg-[#A07828] transition-all duration-300 text-sm"
        >
          Browse Facilities
        </Link>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-20">
        {[
          { label: "Total Facilities", value: facilities.length > 0 ? facilities.length : "--" },
          { label: "Available Today", value: "--" },
          { label: "Total Bookings", value: "--" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-[rgba(0,0,0,0.08)] rounded-xl p-6 text-center"
          >
            <div className="text-[#C8A456] text-4xl font-bold mb-1">{stat.value}</div>
            <div className="text-[#555555] text-sm">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Facilities preview */}
      {preview.length > 0 && (
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[#111111] text-2xl font-bold">Featured Facilities</h2>
            <Link
              href="/facilities"
              className="text-[#C8A456] text-sm font-medium hover:text-[#A07828] transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {preview.map((f) => (
              <FacilityCard key={f.id} facility={f} />
            ))}
          </div>
        </section>
      )}

      {/* CTA band */}
      <section className="bg-white border border-[rgba(0,0,0,0.08)] rounded-2xl p-10 text-center mb-20">
        <h3 className="text-[#111111] text-2xl font-bold mb-3">Ready to book?</h3>
        <p className="text-[#555555] text-sm mb-6 max-w-sm mx-auto">
          Check real-time availability and reserve your spot in under a minute.
        </p>
        <Link
          href="/bookings"
          className="inline-block border border-[rgba(0,0,0,0.12)] text-[#111111] text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[rgba(0,0,0,0.04)] transition-all duration-200"
        >
          View My Bookings
        </Link>
      </section>
    </div>
  );
}
