'use client';

export default function Modal({ open, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-[rgba(247,114,24,0.15)] bg-[#060910] p-6 shadow-[0_0_45px_rgba(246,111,20,0.2)]">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <div className="mt-4 text-[#CAC4DA]">{children}</div>
      </div>
    </div>
  );
}
