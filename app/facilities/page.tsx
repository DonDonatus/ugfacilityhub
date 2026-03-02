"use client";

import { useEffect, useState } from "react";
import { getFacilities } from "@/lib/api";
import FacilityCard from "@/components/FacilityCard";
import { FacilityCardSkeleton } from "@/components/Skeleton";
import type { Facility } from "@/types";

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  function load() {
    setLoading(true);
    setError(false);
    getFacilities()
      .then(setFacilities)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const filtered = facilities.filter((f) => {
    const q = search.toLowerCase();
    return f.name.toLowerCase().includes(q) || f.location.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <p className="text-[#C8A456] text-xs font-medium uppercase tracking-widest mb-1">
            Campus
          </p>
          <h1 className="text-[#111111] text-3xl font-bold">All Facilities</h1>
        </div>
        <input
          type="text"
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white border border-[rgba(0,0,0,0.08)] rounded-lg px-4 h-11 text-[#111111] text-sm w-full sm:w-72 outline-none focus:border-[#C8A456] transition-colors placeholder:text-[#AAAAAA]"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <FacilityCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-[#555555] mb-4">Could not load facilities.</p>
          <button
            onClick={load}
            className="text-sm text-[#C8A456] hover:text-[#A07828] transition-colors"
          >
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#888888] text-sm">
            {search ? `No facilities matching "${search}"` : "No facilities available."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((f) => (
            <FacilityCard key={f.id} facility={f} />
          ))}
        </div>
      )}
    </div>
  );
}
