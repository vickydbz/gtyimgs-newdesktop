import React, { useState, useMemo } from 'react';
import { 
  FileBarChart, 
  Download, 
  Calendar, 
  PieChart, 
  Sliders, 
  CheckCircle2, 
  ArrowUpRight,
  Printer,
  FileSpreadsheet
} from 'lucide-react';
import { StockAsset, RoyaltyStatement, ContributorProfile } from '../types';

interface SalesReportsProps {
  assets: StockAsset[];
  statements: RoyaltyStatement[];
  profile: ContributorProfile;
}

export const SalesReports: React.FC<SalesReportsProps> = ({
  assets,
  statements,
  profile,
}) => {
  const [reportType, setReportType] = useState<'collection' | 'category' | 'resolution' | 'tax'>('collection');
  const [selectedYear, setSelectedYear] = useState<'2026' | '2025' | 'ALL'>('2026');

  const filteredStatements = useMemo(() => {
    if (selectedYear === 'ALL') return statements;
    return statements.filter(s => s.periodYear.toString() === selectedYear);
  }, [statements, selectedYear]);

  // Aggregate totals
  const totalNet = useMemo(() => {
    return filteredStatements.reduce((acc, s) => acc + s.contributorNetUSD, 0);
  }, [filteredStatements]);

  const totalGross = useMemo(() => {
    return filteredStatements.reduce((acc, s) => acc + s.grossBillingsUSD, 0);
  }, [filteredStatements]);

  const totalLicenses = useMemo(() => {
    return filteredStatements.reduce((acc, s) => acc + s.totalLicensesSold, 0);
  }, [filteredStatements]);

  // Collection breakdown
  const collectionData = useMemo(() => {
    let sigLicenses = 0, sigUSD = 0;
    let essLicenses = 0, essUSD = 0;
    let getLicenses = 0, getUSD = 0;
    let extLicenses = 0, extUSD = 0;

    filteredStatements.forEach(s => {
      sigLicenses += s.breakdown.istockSignatureLicenses;
      sigUSD += s.breakdown.istockSignatureUSD;
      essLicenses += s.breakdown.istockEssentialsLicenses;
      essUSD += s.breakdown.istockEssentialsUSD;
      getLicenses += s.breakdown.gettyCreativeLicenses;
      getUSD += s.breakdown.gettyCreativeUSD;
      extLicenses += s.breakdown.extendedLicenses;
      extUSD += s.breakdown.extendedUSD;
    });

    return [
      { name: 'iStock Signature (Exclusive)', licenses: sigLicenses, netUSD: sigUSD, share: ((sigUSD / (totalNet || 1)) * 100).toFixed(1), rate: '40%' },
      { name: 'Getty Images Creative Plus', licenses: getLicenses, netUSD: getUSD, share: ((getUSD / (totalNet || 1)) * 100).toFixed(1), rate: '45%' },
      { name: 'iStock Essentials Tier', licenses: essLicenses, netUSD: essUSD, share: ((essUSD / (totalNet || 1)) * 100).toFixed(1), rate: '25%' },
      { name: 'Extended Commercial Licenses', licenses: extLicenses, netUSD: extUSD, share: ((extUSD / (totalNet || 1)) * 100).toFixed(1), rate: '40%' },
    ];
  }, [filteredStatements, totalNet]);

  // Category breakdown
  const categoryData = useMemo(() => {
    const map: Record<string, { licenses: number; netUSD: number }> = {};
    assets.forEach(a => {
      if (!map[a.category]) map[a.category] = { licenses: 0, netUSD: 0 };
      map[a.category].licenses += a.totalQuantitySold;
      map[a.category].netUSD += a.netRoyaltyUSD;
    });

    const sumEarnings = Object.values(map).reduce((sum, v) => sum + v.netUSD, 0) || 1;

    return Object.entries(map).map(([cat, data]) => ({
      name: cat,
      licenses: data.licenses,
      netUSD: data.netUSD,
      share: ((data.netUSD / sumEarnings) * 100).toFixed(1),
    })).sort((a, b) => b.netUSD - a.netUSD);
  }, [assets]);

  const handleExportCsv = () => {
    let rows: string[][] = [];
    if (reportType === 'collection') {
      rows = [
        ['Collection Channel', 'Licenses Sold', 'Net Royalty USD', 'Share Rate', 'Portfolio Share %'],
        ...collectionData.map(c => [c.name, c.licenses.toString(), c.netUSD.toFixed(2), c.rate, `${c.share}%`]),
      ];
    } else if (reportType === 'category') {
      rows = [
        ['Subject Category', 'Licenses Sold', 'Net Royalty USD', 'Share %'],
        ...categoryData.map(c => [c.name, c.licenses.toString(), c.netUSD.toFixed(2), `${c.share}%`]),
      ];
    } else {
      rows = [
        ['Period Month', 'Statement ID', 'Licenses', 'Gross USD', 'Net USD', 'Tax Withheld', 'Status'],
        ...filteredStatements.map(s => [s.periodMonth, s.statementNumber, s.totalLicensesSold.toString(), s.grossBillingsUSD.toFixed(2), s.contributorNetUSD.toFixed(2), s.taxWithheldUSD.toFixed(2), s.paymentStatus]),
      ];
    }

    const csvContent = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `GettyImages_Sales_Report_${reportType}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b0f17] overflow-hidden text-slate-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-[#0e1420]/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <span>Sales & Performance Reports</span>
            <span className="text-[11px] font-normal text-slate-400">·</span>
            <span className="text-[11px] font-normal text-amber-400 font-mono">Financial Auditing</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured reports segmented by distribution collection, creative category, resolution, and tax compliance
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Year selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            {(['2026', '2025', 'ALL'] as const).map(yr => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1 rounded transition-colors ${
                  selectedYear === yr ? 'bg-slate-800 text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {yr === 'ALL' ? 'Lifetime' : yr}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report (CSV)</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Report Dimension Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/40 rounded-xl p-1 gap-1 text-xs">
          <button
            onClick={() => setReportType('collection')}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
              reportType === 'collection' ? 'bg-slate-800 text-cyan-400 shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            By Collection & Channel
          </button>
          <button
            onClick={() => setReportType('category')}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
              reportType === 'category' ? 'bg-slate-800 text-cyan-400 shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            By Creative Category
          </button>
          <button
            onClick={() => setReportType('resolution')}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
              reportType === 'resolution' ? 'bg-slate-800 text-cyan-400 shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Resolution & Media Specs
          </button>
          <button
            onClick={() => setReportType('tax')}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
              reportType === 'tax' ? 'bg-slate-800 text-cyan-400 shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tax Compliance (W-8BEN / 1042-S)
          </button>
        </div>

        {/* Top Aggregates Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="text-[11px] text-slate-400">Total Net Royalties</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
              ${totalNet.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Credited to Payoneer</div>
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="text-[11px] text-slate-400">Gross Buyer Billings</div>
            <div className="text-xl font-bold font-mono text-slate-100 mt-1 tabular-nums">
              ${totalGross.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Contract Basis</div>
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="text-[11px] text-slate-400">Total Licenses Licensed</div>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
              {totalLicenses.toLocaleString()} units
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">100% Commercial RF</div>
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="text-[11px] text-slate-400">Effective Average RPD</div>
            <div className="text-xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
              ${(totalNet / (totalLicenses || 1)).toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Per Licensed Asset</div>
          </div>
        </div>

        {/* Dynamic Report View */}
        {reportType === 'collection' && (
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-slate-100">Distribution Channel Performance</h3>
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-[#0d131f] border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-3 px-4 font-semibold">Channel</th>
                  <th className="py-3 px-4 font-semibold text-right">Licenses Sold</th>
                  <th className="py-3 px-4 font-semibold text-right">Contributor Share</th>
                  <th className="py-3 px-4 font-semibold text-right">Net Royalties (USD)</th>
                  <th className="py-3 px-4 font-semibold text-right">Portfolio Share %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {collectionData.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-sans font-medium text-slate-200">{c.name}</td>
                    <td className="py-3.5 px-4 text-right text-slate-300 tabular-nums">{c.licenses}</td>
                    <td className="py-3.5 px-4 text-right text-slate-400">{c.rate}</td>
                    <td className="py-3.5 px-4 text-right font-semibold text-emerald-400 tabular-nums">${c.netUSD.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-right text-cyan-400 tabular-nums">{c.share}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'category' && (
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-slate-100">Sales by Subject & Commercial Category</h3>
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-[#0d131f] border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold text-right">Units Sold</th>
                  <th className="py-3 px-4 font-semibold text-right">Net Royalties (USD)</th>
                  <th className="py-3 px-4 font-semibold text-right">Revenue Contribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {categoryData.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-sans font-medium text-slate-200">{c.name}</td>
                    <td className="py-3.5 px-4 text-right text-slate-300 tabular-nums">{c.licenses}</td>
                    <td className="py-3.5 px-4 text-right font-semibold text-emerald-400 tabular-nums">${c.netUSD.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-right text-cyan-400 tabular-nums">{c.share}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'resolution' && (
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-slate-100">Media Resolution & Technical Specs Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950/60 rounded-lg border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-200">Ultra High-Res 60MP+ (Full Frame)</div>
                <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">68.2%</div>
                <p className="text-[11px] text-slate-400">Highest licensing rate for print advertising and large billboard placement.</p>
              </div>
              <div className="p-4 bg-slate-950/60 rounded-lg border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-200">High-Res 40MP - 50MP</div>
                <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">24.5%</div>
                <p className="text-[11px] text-slate-400">Corporate web headers, annual reports, and app publishing.</p>
              </div>
              <div className="p-4 bg-slate-950/60 rounded-lg border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-200">Extended Resale Licenses</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">7.3%</div>
                <p className="text-[11px] text-slate-400">Premium commercial packaging and merchandise reproduction.</p>
              </div>
            </div>
          </div>
        )}

        {reportType === 'tax' && (
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">US Tax Compliance & W-8BEN Status</h3>
                <p className="text-xs text-slate-400">Annual Foreign Person’s U.S. Source Income certification</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 text-xs font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>W-8BEN Active</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-950/60 rounded-lg border border-slate-800 space-y-2">
                <div className="text-slate-400 text-[11px]">US Statutory Withholding Rate</div>
                <div className="text-lg font-bold font-mono text-slate-100">0% (Treaty Rate Applied)</div>
                <p className="text-slate-500 text-[11px]">Standard rate without W-8BEN is 30% for non-resident aliens.</p>
              </div>
              <div className="p-4 bg-slate-950/60 rounded-lg border border-slate-800 space-y-2">
                <div className="text-slate-400 text-[11px]">IRS Form 1042-S Availability</div>
                <div className="text-lg font-bold font-mono text-slate-100">Annual Release: March 15</div>
                <p className="text-slate-500 text-[11px]">Statements and tax documentation delivered electronically via ESP portal.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
