'use client';

export default function StatusBadge({ status }) {
  const map = {
    active: 'bg-emerald-500/15 text-emerald-300',
    delayed: 'bg-amber-500/15 text-amber-300',
    maintenance: 'bg-[#F66F14]/15 text-[#F66F14]',
    completed: 'bg-sky-500/15 text-sky-300',
    unavailable: 'bg-rose-500/15 text-rose-300',
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${map[status] || 'bg-white/10 text-white'}`}>{status}</span>;
}
