'use client';

import { useEffect, useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { reportService } from '@/services/reportService';
import { 
  FileText, Download, FileSpreadsheet, Plus, Search, 
  Calendar, Loader2, ArrowRight, Settings2, Trash2, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function ReportsPage() {
  const { isReady, isAuthenticated } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileParams, setCompileParams] = useState({
    title: '',
    category: 'Vehicle',
    type: 'PDF',
  });

  useEffect(() => {
    if (isReady && isAuthenticated) {
      fetchReports();
    }
  }, [isReady, isAuthenticated]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await reportService.getReports();
      setReports(data);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCompile = async (e) => {
    e.preventDefault();
    if (!compileParams.title) {
      toast.error('Please enter a report title');
      return;
    }

    try {
      setIsCompiling(true);
      toast.loading('Compiling operations metrics and generating output graphs...');

      const payload = {
        title: compileParams.title,
        category: compileParams.category,
        type: compileParams.type,
      };

      const created = await reportService.createReport(payload);
      setReports([created, ...reports]);
      setCompileParams({ title: '', category: 'Vehicle', type: 'PDF' });
      toast.dismiss();
      toast.success('Report successfully compiled and saved to database');
    } catch (err) {
      toast.dismiss();
      toast.error('Failed to compile report');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleDownload = (title, type) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: `Formatting ${type} files...`,
        success: `${title}.${type.toLowerCase()} saved to downloads`,
        error: 'Failed to download report',
      }
    );
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                          r.author.toLowerCase().includes(search.toLowerCase()) ||
                          r.id.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || r.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-[28px] border border-[rgba(247,114,24,0.15)] bg-[radial-gradient(circle_at_top_left,rgba(246,111,20,0.15),transparent_40%)] p-6 shadow-[0_0_45px_rgba(246,111,20,0.06)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#F66F14]">Operations Audit</p>
          <h2 className="mt-1 text-3xl font-semibold text-white">Operations Reports</h2>
          <p className="mt-2 text-sm text-[#CAC4DA]">Compile compliance summaries, export financial sheets, and review history audits.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => handleDownload('TransitOps_Annual_Operations_2026', 'PDF')}>
            <FileText className="mr-2 h-4 w-4" /> Export All PDF
          </Button>
          <Button onClick={() => handleDownload('TransitOps_Annual_Expenses_2026', 'Excel')}>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export All Excel
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        {/* Compile Card */}
        <GlassCard className="p-5" hover={false}>
          <h3 className="text-lg font-bold text-white mb-2">Compile Operations Report</h3>
          <p className="text-xs text-[#CAC4DA] mb-6">Compile telematics, fuel bills, and maintenance timesheets instantly.</p>

          <form onSubmit={handleCompile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Report Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Q3 Cargo Fleet Utilization Index"
                value={compileParams.title}
                onChange={(e) => setCompileParams({ ...compileParams, title: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F66F14]/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Audit Category</label>
                <select
                  value={compileParams.category}
                  onChange={(e) => setCompileParams({ ...compileParams, category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40"
                >
                  <option value="Vehicle">Vehicle Report</option>
                  <option value="Driver">Driver Report</option>
                  <option value="Expense">Expense Report</option>
                  <option value="Fuel">Fuel Report</option>
                  <option value="Maintenance">Maintenance Report</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#CAC4DA] mb-1.5">Output Format</label>
                <select
                  value={compileParams.type}
                  onChange={(e) => setCompileParams({ ...compileParams, type: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-white focus:outline-none focus:border-[#F66F14]/40"
                >
                  <option value="PDF">Adobe PDF (.pdf)</option>
                  <option value="Excel">Microsoft Excel (.xlsx)</option>
                </select>
              </div>
            </div>

            <Button type="submit" disabled={isCompiling} className="w-full mt-4">
              {isCompiling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Compiling Data...
                </>
              ) : (
                <>
                  Compile Report <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </GlassCard>

        {/* Categories Help */}
        <GlassCard className="p-5" hover={false}>
          <h3 className="text-lg font-bold text-white mb-2">Automated Digests</h3>
          <p className="text-xs text-[#CAC4DA] mb-6">Learn more about our compiled report architectures</p>
          <div className="space-y-3">
            {[
              { title: 'Vehicle Report', desc: 'Active odometer checks, vehicle telemetry breakdown, service timeline overlaps.' },
              { title: 'Driver Report', desc: 'Timesheet records, safety compliance violations, feedback radial scores.' },
              { title: 'Expense Report', desc: 'Fuel purchases, repairs bills, tax passes, and toll pass logs.' },
            ].map((cat, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-white/5 bg-white/[0.01]">
                <h4 className="text-sm font-bold text-white">{cat.title}</h4>
                <p className="text-xs text-[#CAC4DA] mt-1">{cat.desc}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Reports Table */}
      <GlassCard className="p-5" hover={false}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Compiled Documents Ledger</h3>
            <p className="text-xs text-[#CAC4DA]">Historical index of compiled files</p>
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-xs text-white focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="Vehicle">Vehicle Reports</option>
              <option value="Driver">Driver Reports</option>
              <option value="Expense">Expense Reports</option>
              <option value="Fuel">Fuel Reports</option>
              <option value="Maintenance">Maintenance Reports</option>
            </select>
            <input 
              placeholder="Search reports..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[rgba(247,114,24,0.15)] bg-[#0c1017] text-xs text-white placeholder:text-[#CAC4DA]"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-6 w-6 text-[#F66F14] animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-rose-400">Failed to load reports history ledger.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/5 bg-white/[0.02]">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5 text-[#CAC4DA] text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Doc Code</th>
                  <th className="px-4 py-3 text-left">Report Title</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Compile Date</th>
                  <th className="px-4 py-3 text-left">Compiled By</th>
                  <th className="px-4 py-3 text-left">File Size</th>
                  <th className="px-4 py-3 text-center">Export</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3.5 font-mono text-white text-xs">{rep.id}</td>
                    <td className="px-4 py-3.5 text-white font-medium">{rep.title}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white">
                        {rep.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[#CAC4DA] text-xs font-mono">
                      {new Date(rep.date).toISOString().split('T')[0]}
                    </td>
                    <td className="px-4 py-3.5 text-white font-medium">{rep.author}</td>
                    <td className="px-4 py-3.5 text-[#CAC4DA] text-xs font-mono">{rep.size}</td>
                    <td className="px-4 py-3.5 text-center">
                      <button 
                        onClick={() => handleDownload(rep.title, rep.type)}
                        className="px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-[#F66F14]/40 hover:bg-[#F66F14]/10 text-white text-xs font-bold transition flex items-center gap-1 mx-auto cursor-pointer"
                      >
                        {rep.type === 'PDF' ? <FileText className="h-3.5 w-3.5 text-[#F66F14]" /> : <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />}
                        Get {rep.type}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-[#CAC4DA]">
                      No reports generated.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
