'use client';

export default function LoadingSkeleton({ rows = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-16 animate-pulse rounded-[20px] border border-[rgba(247,114,24,0.15)] bg-[rgba(255,255,255,0.05)]" />
      ))}
    </div>
  );
}
