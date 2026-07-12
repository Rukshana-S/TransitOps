'use client';

export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-2xl border border-[rgba(247,114,24,0.15)] bg-[rgba(6,9,16,0.75)] px-4 py-3 text-sm text-white outline-none transition focus:border-[#F66F14]/40 ${className}`}
      {...props}
    />
  );
}
