'use client';

import { useState } from 'react';
import { X, FileText, FileSpreadsheet, Download, Loader2 } from 'lucide-react';
import Button from './Button';
import GlassCard from './GlassCard';

export default function ExportModal({ isOpen, onClose, onExport, title = 'Export Report' }) {
  const [format, setFormat] = useState('PDF');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onExport(format);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <GlassCard className="w-full max-w-md p-6 border border-[rgba(247,114,24,0.2)]" hover={false}>
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
          <h3 className="text-lg font-bold text-white tracking-wide">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-3">
              Select Download Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'PDF', label: 'PDF Document', icon: FileText, desc: '.pdf file' },
                { id: 'EXCEL', label: 'Excel Sheet', icon: FileSpreadsheet, desc: '.xlsx file' },
                { id: 'CSV', label: 'CSV Spreadsheet', icon: FileSpreadsheet, desc: '.csv file' }
              ].map(opt => {
                const Icon = opt.icon;
                const isSelected = format === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormat(opt.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                      isSelected 
                        ? 'border-[#F66F14] bg-[#F66F14]/10 text-white shadow-[0_0_15px_rgba(246,111,20,0.15)]' 
                        : 'border-white/5 bg-[#0c1017] text-[#CAC4DA] hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className={`h-6 w-6 mb-2 ${isSelected ? 'text-[#F66F14]' : 'text-gray-400'}`} />
                    <span className="text-xs font-bold">{opt.id}</span>
                    <span className="text-[9px] opacity-75 mt-0.5">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 justify-end border-t border-white/5 pt-4">
            <Button variant="secondary" type="button" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Compiling...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> Download Report
                </>
              )}
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
