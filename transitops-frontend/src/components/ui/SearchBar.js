'use client';

import { Search } from 'lucide-react';
import Input from '@/components/ui/Input';

export default function SearchBar({ placeholder = 'Search...', className = '' }) {
  return (
    <label className={`flex items-center gap-2 rounded-2xl border border-[rgba(247,114,24,0.15)] bg-[rgba(6,9,16,0.7)] px-3 py-2 ${className}`}>
      <Search className="h-4 w-4 text-[#CAC4DA]" />
      <Input placeholder={placeholder} className="border-none bg-transparent px-0 py-0 text-sm" />
    </label>
  );
}
