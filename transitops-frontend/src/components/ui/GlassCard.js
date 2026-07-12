'use client';

export default function GlassCard({ children, className = '', hover = true }) {
  return (
    <div
      className={`rounded-[18px] border border-[rgba(247,114,24,0.15)] bg-[rgba(33,33,33,0.25)] shadow-[0_0_30px_rgba(246,111,20,0.06)] backdrop-blur-xl transition-all duration-300 ${hover ? 'orange-glow-hover' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
