import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  Calendar, 
  Search, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Archive,
  ArrowUpDown,
  CreditCard,
  DollarSign
} from 'lucide-react';
import { RoyaltyStatement, ContributorProfile } from '../types';
import { RoyaltyStatementModal } from './RoyaltyStatementModal';

interface RoyaltiesLedgerProps {
  statements: RoyaltyStatement[];
  profile: ContributorProfile;
}

export const RoyaltiesLedger: React.FC<RoyaltiesLedgerProps> = ({
  statements,
  profile,
}) => {
  const [selectedStatement, setSelectedStatement] = useState<RoyaltyStatement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [yearFilter, setYearFilter] = useState<'All' | '2026' | '2025' | '2024'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Processing'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [batchDownloading, setBatchDownloading] = useState(false);

  const filteredStatements = useMemo(() => {
    return statements.filter(stmt => {
      if (yearFilter !== 'All' && stmt.periodYear.toString() !== yearFilter) return false;
      if (statusFilter !== 'All' && stmt.paymentStatus !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          stmt.statementNumber.toLowerCase().includes(q) ||
          stmt.periodMonth.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [statements, yearFilter, statusFilter, searchQuery]);

  const totalGross = useMemo(() => {
    return filteredStatements.reduce((sum, s) => sum + s.grossBillingsUSD, 0);
  }, [filteredStatements]);

  const totalNet = useMemo(() => {
    return filteredStatements.reduce((sum, s) => sum + s.contributorNetUSD, 0);
  }, [filteredStatements]);

  const totalLicenses = useMemo(() => {
    return filteredStatements.reduce((sum, s) => sum + s.totalLicensesSold, 0);
  }, [filteredStatements]);

  const handleOpenStatement = (stmt: RoyaltyStatement) => {
    setSelectedStatement(stmt);
    setIsModalOpen(true);
  };

  const handleDownloadCsv = (stmt: RoyaltyStatement, e: React.MouseEvent) => {
    e.stopPropagation();
    const csvContent = [
      ['Statement Reference', stmt.statementNumber],
      ['Period Month', stmt.periodMonth],
      ['Payout Date', stmt.payoutDate],
      ['Gross Billings (USD)', stmt.grossBillingsUSD.toFixed(2)],
      ['Net Royalty (USD)', stmt.contributorNetUSD.toFixed(2)],
      ['Licenses Sold', stmt.totalLicensesSold],
      ['Tax Withheld', stmt.taxWithheldUSD.toFixed(2)],
      ['Payment Status', stmt.paymentStatus],
      ['Payout Method', stmt.payoutMethod],
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `${stmt.statementNumber}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleBatchDownloadAll = () => {
    setBatchDownloading(true);
    setTimeout(() => {
      // Create consolidated master CSV archive of all statements
      const headers = [
        'Statement Number',
        'Period Month',
        'Year',
        'Gross Billings USD',
        'Contributor Net Royalty USD',
        'Total Licenses Sold',
        'Tax Withheld USD',
        'Disbursement Date',
        'Status',
        'Payout Destination'
      ];

      const rows = statements.map(s => [
        s.statementNumber,
        `"${s.periodMonth}"`,
        s.periodYear,
        s.grossBillingsUSD.toFixed(2),
        s.contributorNetUSD.toFixed(2),
        s.totalLicensesSold,
        s.taxWithheldUSD.toFixed(2),
        s.payoutDate,
        s.paymentStatus,
        `"${s.payoutMethod}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', `GettyImages_All_Royalty_Documents_2024_2026.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setBatchDownloading(false);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b0f17] overflow-hidden text-slate-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-[#0e1420]/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <span>Monthly Royalty Documents & Statements Archive</span>
            <span className="text-[11px] font-normal text-slate-400">·</span>
            <span className="text-[11px] font-normal text-emerald-400 font-mono">24 Months On Record</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Download and audit month-by-month financial royalty statements, W-8BEN tax certifications, and payment receipts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleBatchDownloadAll}
            disabled={batchDownloading}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center gap-2 transition-colors disabled:opacity-50 shadow-xs"
            title="Download full 24-month consolidated financial ledger as CSV"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>{batchDownloading ? 'Bundling Statements...' : 'Download All Documents (Batch Export)'}</span>
          </button>
        </div>
      </div>

      {/* High-Level Financial Ledger Metrics */}
      <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/30 border-b border-slate-800 shrink-0">
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg">
          <div className="text-[11px] text-slate-400">Total Net Royalties (Filtered)</div>
          <div className="text-lg font-bold text-slate-100 font-mono mt-0.5 tabular-nums">
            ${totalNet.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>W-8BEN 0% Withholding Applied</span>
          </div>
        </div>

        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg">
          <div className="text-[11px] text-slate-400">Gross Customer Billings</div>
          <div className="text-lg font-bold text-slate-100 font-mono mt-0.5 tabular-nums">
            ${totalGross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">40% Contributor Signature Share</div>
        </div>

        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg">
          <div className="text-[11px] text-slate-400">Total Licenses Paid</div>
          <div className="text-lg font-bold text-slate-100 font-mono mt-0.5 tabular-nums">
            {totalLicenses.toLocaleString()} <span className="text-xs font-normal text-slate-400">units</span>
          </div>
          <div className="text-[10px] text-cyan-400 mt-1">Average RPD: ${(totalNet / (totalLicenses || 1)).toFixed(2)}</div>
        </div>

        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg">
          <div className="text-[11px] text-slate-400">Disbursement Channel</div>
          <div className="text-sm font-semibold text-slate-200 mt-0.5 truncate">
            {profile.payoutProvider} USD
          </div>
          <div className="text-[10px] text-slate-400 mt-1 truncate">
            {profile.payoutAccount}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="px-6 py-3 border-b border-slate-800 bg-[#0d131f] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          {/* Year Filter */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            {(['All', '2026', '2025', '2024'] as const).map(yr => (
              <button
                key={yr}
                onClick={() => setYearFilter(yr)}
                className={`px-3 py-1 rounded transition-colors ${
                  yearFilter === yr ? 'bg-slate-800 text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            {(['All', 'Paid', 'Processing'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded transition-colors ${
                  statusFilter === st ? 'bg-slate-800 text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search statement number or month..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Month-by-Month Statements Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="sticky top-0 bg-[#0d131f] border-b border-slate-800 text-slate-400 select-none z-10">
            <tr>
              <th className="py-3 px-6 font-semibold">Royalty Period</th>
              <th className="py-3 px-4 font-semibold">Statement Reference</th>
              <th className="py-3 px-4 font-semibold text-right">Licenses Sold</th>
              <th className="py-3 px-4 font-semibold text-right">Gross Billings</th>
              <th className="py-3 px-4 font-semibold text-right">Net Royalty (USD)</th>
              <th className="py-3 px-4 font-semibold text-center">Status</th>
              <th className="py-3 px-4 font-semibold">Disbursement Date</th>
              <th className="py-3 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredStatements.map((stmt) => (
              <tr 
                key={stmt.id}
                onClick={() => handleOpenStatement(stmt)}
                className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
              >
                {/* Period Month */}
                <td className="py-3.5 px-6 font-sans font-medium text-slate-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{stmt.periodMonth}</span>
                  </div>
                </td>

                {/* Statement Reference */}
                <td className="py-3.5 px-4 text-slate-400 group-hover:text-cyan-300 transition-colors">
                  {stmt.statementNumber}
                </td>

                {/* Total Licenses */}
                <td className="py-3.5 px-4 text-right text-slate-300 tabular-nums">
                  {stmt.totalLicensesSold}
                </td>

                {/* Gross */}
                <td className="py-3.5 px-4 text-right text-slate-400 tabular-nums">
                  ${stmt.grossBillingsUSD.toFixed(2)}
                </td>

                {/* Net Contributor Royalty */}
                <td className="py-3.5 px-4 text-right font-semibold text-emerald-400 tabular-nums">
                  ${stmt.contributorNetUSD.toFixed(2)}
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-sans ${
                    stmt.paymentStatus === 'Paid'
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                      : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                  }`}>
                    {stmt.paymentStatus === 'Paid' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    <span>{stmt.paymentStatus}</span>
                  </span>
                </td>

                {/* Payout Date */}
                <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                  {stmt.payoutDate}
                </td>

                {/* Action Buttons */}
                <td className="py-3.5 px-6 text-right font-sans" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenStatement(stmt)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium flex items-center gap-1 transition-colors border border-slate-700"
                      title="View & Print Official PDF Royalty Statement"
                    >
                      <Eye className="w-3 h-3 text-cyan-400" />
                      <span>PDF</span>
                    </button>
                    <button
                      onClick={(e) => handleDownloadCsv(stmt, e)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors border border-slate-700"
                      title="Download Monthly Statement CSV"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Statement Modal Document */}
      <RoyaltyStatementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        statement={selectedStatement}
        profile={profile}
      />
    </div>
  );
};
