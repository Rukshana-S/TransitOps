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
  const { isReady, isAuthenticated, role } = useAuth();
  const isAllowed = ['Fleet Manager', 'Financial Analyst'].includes(role);
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
  }, [isReady, isAuthenticated, search, categoryFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await reportService.getReports(search, categoryFilter);
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

      const created = await reportService.compileReport(
        compileParams.category,
        compileParams.type,
        compileParams.title
      );
      
      setReports([created, ...reports]);
      setCompileParams({ title: '', category: 'Vehicle', type: 'PDF' });
      toast.dismiss();
      toast.success('Report successfully compiled and saved to database');
      
      // Auto download
      window.open(created.file_url, '_blank');
    } catch (err) {
      toast.dismiss();
      toast.error('Failed to compile report');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleDownload = (report) => {
    if (report.file_url) {
      window.open(report.file_url, '_blank');
      toast.success(`Downloading ${report.title} (${report.type})`);
    } else {
      toast.error('Download link not found for this report');
    }
  };

  const handleHeaderExport = async (format) => {
    try {
      toast.loading(`Compiling global ${format} report...`);
      const report = await reportService.compileReport('Vehicle', format, `Global Fleet ${format} Export`);
      toast.dismiss();
      toast.success('Report compiled successfully! Download starting.');
      window.open(report.file_url, '_blank');
      fetchReports();
    } catch (err) {
      toast.dismiss();
      toast.error(`Failed to compile ${format} report`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report record?')) return;
    try {
      await reportService.deleteReport(id);
      setReports(reports.filter(r => r.id !== id));
      toast.success('Report record deleted successfully');
    } catch (err) {
      toast.error('Failed to delete report');
    }
  };

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
          <Button variant="secondary" onClick={() => handleHeaderExport('PDF')}>
            <FileText className="mr-2 h-4 w-4" /> Export PDF
          </Button>
          <Button variant="secondary" onClick={() => handleHeaderExport('Excel')}>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel
          </Button>
          <Button onClick={() => handleHeaderExport('ZIP')}>
            <Download className="mr-2 h-4 w-4" /> Export All (ZIP)
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        {/* Compile Card */}
        {isAllowed ? (
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
                    <option value="Trips">Trip Report</option>
                    <option value="Maintenance">Maintenance Report</option>
                    <option value="Fuel">Fuel Report</option>
                    <option value="Expense">Expense Report</option>
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
                    <option value="CSV">Comma Separated Values (.csv)</option>
                    <option value="ZIP">ZIP Archive Bundle (.zip)</option>
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
        ) : (
          <GlassCard className="p-5" hover={false}>
            <h3 className="text-lg font-bold text-white mb-2">Compile Operations Report</h3>
            <p className="text-xs text-[#CAC4DA] mb-6">Compile telematics, fuel bills, and maintenance timesheets instantly.</p>
            <div className="p-6 text-center border border-dashed border-white/5 rounded-xl bg-white/[0.01]">
              <p className="text-sm font-semibold text-[#CAC4DA]">Read-Only Access Mode</p>
              <p className="text-xs text-gray-500 mt-1">Your user role does not have authorization to compile new reports.</p>
            </div>
          </GlassCard>
        )}

        {/* Categories Help */}
        <GlassCard className="p-5" hover={false}>
          <h3 className="text-lg font-bold text-white mb-2">Automated Digests</h3>
          <p className="text-xs text-[#CAC4DA] mb-6">Learn more about our compiled report architectures</p>

          <div className="space-y-4">
            <div className="rounded-xl border border-white/5 bg-white/[0.01] p-3 text-xs">
              <p className="font-semibold text-white">Full Database Schema Audit</p>
              <p className="text-[#CAC4DA] mt-1">Queries all live tables including vehicles status, dispatch logs, expense tracking, and notifications.</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.01] p-3 text-xs">
              <p className="font-semibold text-[#F66F14]">ZIP Archive Compilations</p>
              <p className="text-[#CAC4DA] mt-1">Compiles complete data sets in all formats (PDF, CSV, and Excel) in a single ZIP package.</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* History Table */}
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
              <option value="Trips">Trip Reports</option>
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
                {reports.map((rep) => (
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
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleDownload(rep)}
                          className="px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-[#F66F14]/40 hover:bg-[#F66F14]/10 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          {rep.type === 'PDF' ? <FileText className="h-3.5 w-3.5 text-[#F66F14]" /> : <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />}
                          Get {rep.type}
                        </button>
                        {isAllowed && (
                          <button
                            onClick={() => handleDelete(rep.id)}
                            className="p-1.5 rounded-lg border border-white/10 hover:border-rose-500/40 hover:bg-rose-500/10 text-rose-400 transition cursor-pointer"
                            title="Delete Report"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && (
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
