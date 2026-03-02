interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`shimmer rounded-md ${className}`} aria-hidden="true" />;
}

export function FacilityCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-5 border border-[rgba(0,0,0,0.08)]">
      <div className="shimmer rounded-lg h-40 w-full mb-4" />
      <div className="shimmer h-5 w-3/4 rounded mb-2" />
      <div className="shimmer h-4 w-1/2 rounded mb-4" />
      <div className="shimmer h-3 w-full rounded mb-2" />
      <div className="shimmer h-3 w-2/3 rounded" />
    </div>
  );
}

export function BookingRowSkeleton() {
  return (
    <tr className="border-b border-[rgba(0,0,0,0.05)]">
      {[...Array(5)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="shimmer h-4 w-full rounded" />
        </td>
      ))}
    </tr>
  );
}
