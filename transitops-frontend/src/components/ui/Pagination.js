'use client';

export default function Pagination() {
  return (
    <div className="mt-4 flex items-center justify-end gap-2">
      {['1', '2', '3'].map((page) => (
        <button key={page} className="rounded-full border border-[rgba(247,114,24,0.15)] bg-[rgba(33,33,33,0.3)] px-3 py-2 text-sm text-[#CAC4DA] transition hover:text-white">
          {page}
        </button>
      ))}
    </div>
  );
}
