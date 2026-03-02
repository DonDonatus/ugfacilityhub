export default function Footer() {
  return (
    <footer className="border-t border-[rgba(0,0,0,0.08)] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <span className="text-[#888888] text-sm">UG FacilityHub</span>
        <span className="text-[#888888] text-sm">
          University of Ghana &mdash; {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
