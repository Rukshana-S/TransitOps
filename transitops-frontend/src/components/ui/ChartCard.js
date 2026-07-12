'use client';

import GlassCard from '@/components/ui/GlassCard';

export default function ChartCard({ title, subtitle, children }) {
  return (
    <GlassCard className="p-5">
      <div className="mb-4">
        <p className="text-sm text-[#CAC4DA]">{title}</p>
        <h3 className="text-xl font-semibold text-white">{subtitle}</h3>
      </div>
      {children}
    </GlassCard>
  );
}
