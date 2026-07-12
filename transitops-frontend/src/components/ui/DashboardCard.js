'use client';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

export default function DashboardCard({ title, value, detail, icon: Icon, trend = '+12%', accent }) {
  const isPositive = trend && trend.startsWith('+');
  const isNeutral = trend && trend.startsWith('0') || !trend;
  
  return (
    <GlassCard className="p-5 border border-[rgba(247,114,24,0.15)] bg-[rgba(33,33,33,0.22)] shadow-[0_0_30px_rgba(246,111,20,0.04)] orange-glow-hover hover:border-[#F66F14]/40" hover={true}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#CAC4DA]">{title}</p>
          <p className="text-3xl font-extrabold text-white tracking-tight">{value}</p>
        </div>
        {Icon && (
          <div className="rounded-xl border border-[rgba(247,114,24,0.15)] bg-[rgba(246,111,20,0.12)] p-2.5 text-[#F66F14] shadow-[0_0_15px_rgba(246,111,20,0.15)]">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      
      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs">
        {trend && (
          <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-bold ${
            isPositive ? 'bg-emerald-500/10 text-emerald-400' : 
            isNeutral ? 'bg-white/10 text-[#CAC4DA]' : 
            'bg-rose-500/10 text-rose-400'
          }`}>
            {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend}
          </span>
        )}
        <span className="text-[11px] font-medium text-[#CAC4DA]">{detail}</span>
      </div>
    </GlassCard>
  );
}
