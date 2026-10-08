import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Layers, 
  BarChart3, 
  Filter, 
  ArrowUpRight, 
  Image, 
  ExternalLink,
  ChevronRight,
  Globe,
  Tag,
  Camera,
  Calendar
} from 'lucide-react';
import { StockAsset, RoyaltyStatement, ContributorProfile } from '../types';

interface SalesDashboardProps {
  assets: StockAsset[];
  statements: RoyaltyStatement[];
  profile: ContributorProfile;
}

export const SalesDashboard: React.FC<SalesDashboardProps> = ({
  assets,
  statements,
  profile,
}) => {
  const [timeRange, setTimeRange] = useState<'12M' | '6M' | 'ALL'>('12M');
  const [selectedAsset, setSelectedAsset] = useState<StockAsset | null>(assets[0] || null);
  const [sortBy, setSortBy] = useState<'earnings' | 'quantity' | 'recent'>('earnings');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Filter statements according to timeRange
  const displayedStatements = useMemo(() => {
    const list = [...statements].reverse(); // chronologically
    if (timeRange === '6M') return list.slice(-6);
    if (timeRange === '12M') return list.slice(-12);
    return list;
  }, [statements, timeRange]);

  // Aggregate metrics
  const totalNetEarnings = useMemo(() => {
    return displayedStatements.reduce((sum, s) => sum + s.contributorNetUSD, 0);
  }, [displayedStatements]);

  const totalLicensesSold = useMemo(() => {
    return displayedStatements.reduce((sum, s) => sum + s.totalLicensesSold, 0);
  }, [displayedStatements]);

  const averageRPD = useMemo(() => {
    return totalLicensesSold > 0 ? (totalNetEarnings / totalLicensesSold).toFixed(2) : '0.00';
  }, [totalNetEarnings, totalLicensesSold]);

  // Sorted and filtered assets
  const salesAssets = useMemo(() => {
    return assets
      .filter(a => a.totalQuantitySold > 0)
      .filter(a => categoryFilter === 'ALL' || a.category === categoryFilter)
      .sort((a, b) => {
        if (sortBy === 'earnings') return b.netRoyaltyUSD - a.netRoyaltyUSD;
        if (sortBy === 'quantity') return b.totalQuantitySold - a.totalQuantitySold;
        return new Date(b.lastLicensedDate).getTime() - new Date(a.lastLicensedDate).getTime();
      });
  }, [assets, sortBy, categoryFilter]);

  // SVG Chart calculations
  const maxEarnings = useMemo(() => {
    return Math.max(...displayedStatements.map(s => s.contributorNetUSD), 100);
  }, [displayedStatements]);

  const maxLicenses = useMemo(() => {
    return Math.max(...displayedStatements.map(s => s.totalLicensesSold), 10);
  }, [displayedStatements]);

  const chartWidth = 720;
  const chartHeight = 160;

  const points = useMemo(() => {
    if (displayedStatements.length === 0) return '';
    return displayedStatements.map((s, idx) => {
      const x = (idx / (displayedStatements.length - 1 || 1)) * chartWidth;
      const y = chartHeight - (s.contributorNetUSD / maxEarnings) * (chartHeight - 20) - 10;
      return `${x},${y}`;
    }).join(' ');
  }, [displayedStatements, maxEarnings]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b0f17] overflow-hidden text-slate-200">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-[#0e1420]/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <span>Sales & Licensing Analytics Dashboard</span>
            <span className="text-[11px] font-normal text-slate-400">·</span>
            <span className="text-[11px] font-normal text-cyan-400 font-mono">Live Contributor Telemetry</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Track individual photo licensing quantities, revenue trajectory, and top-selling portfolio assets
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          {(['6M', '12M', 'ALL'] as const).map(tr => (
            <button
              key={tr}
              onClick={() => setTimeRange(tr)}
              className={`px-3 py-1 rounded transition-colors ${
                timeRange === tr ? 'bg-slate-800 text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tr === 'ALL' ? 'All Time (24M)' : tr}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Contributor Net</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-slate-100 font-mono mt-2 tabular-nums">
              ${totalNetEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3 h-3" />
              <span>+14.8% YoY growth</span>
            </div>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Licenses Sold (Volume)</span>
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-slate-100 font-mono mt-2 tabular-nums">
              {totalLicensesSold.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Across 48 buyer territories
            </div>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Average RPD (Royalty Per Download)</span>
              <BarChart3 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-slate-100 font-mono mt-2 tabular-nums">
              ${averageRPD}
            </div>
            <div className="text-[11px] text-amber-400/90 mt-1">
              {profile.tier} Rate Premium
            </div>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Active Catalog Assets</span>
              <Image className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-slate-100 font-mono mt-2 tabular-nums">
              {profile.activeAssets}
            </div>
            <div className="text-[11px] text-purple-400 mt-1">
              100% Commercial RF approved
            </div>
          </div>
        </div>

        {/* Visual Charts: Earnings Area Chart & Volume Bar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Earnings Timeline Curve */}
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-slate-100">Monthly Net Royalty Trend (USD)</h3>
                <p className="text-[11px] text-slate-400">Monthly disbursements credited on the 25th</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                Peak: ${maxEarnings.toFixed(2)}
              </span>
            </div>

            <div className="relative pt-2">
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                className="w-full h-36 overflow-visible"
              >
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal grid lines */}
                <line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                <line x1="0" y1={chartHeight * 0.75} x2={chartWidth} y2={chartHeight * 0.75} stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                
                {/* Area fill */}
                {points && (
                  <polygon
                    points={`0,${chartHeight} ${points} ${chartWidth},${chartHeight}`}
                    fill="url(#areaGrad)"
                  />
                )}
                
                {/* Line stroke */}
                {points && (
                  <polyline
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />
                )}

                {/* Point nodes */}
                {displayedStatements.map((s, idx) => {
                  const x = (idx / (displayedStatements.length - 1 || 1)) * chartWidth;
                  const y = chartHeight - (s.contributorNetUSD / maxEarnings) * (chartHeight - 20) - 10;
                  return (
                    <g key={s.id} className="cursor-pointer group">
                      <circle cx={x} cy={y} r="3.5" fill="#0891b2" stroke="#e0f2fe" strokeWidth="1.5" />
                    </g>
                  );
                })}
              </svg>

              {/* Month Labels */}
              <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-2">
                <span>{displayedStatements[0]?.periodMonth.split(' ')[0]}</span>
                <span>{displayedStatements[Math.floor(displayedStatements.length / 2)]?.periodMonth.split(' ')[0]}</span>
                <span>{displayedStatements[displayedStatements.length - 1]?.periodMonth.split(' ')[0]}</span>
              </div>
            </div>
          </div>

          {/* Licenses Sold Quantity Bar Chart */}
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-slate-100">Licenses Download Volume (Quantities)</h3>
                <p className="text-[11px] text-slate-400">Number of image licenses purchased by customers</p>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-semibold">
                Peak: {maxLicenses} units
              </span>
            </div>

            <div className="h-36 flex items-end justify-between gap-1.5 pt-4">
              {displayedStatements.map((stmt) => {
                const heightPercent = (stmt.totalLicensesSold / maxLicenses) * 100;
                return (
                  <div key={stmt.id} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="w-full bg-slate-800 rounded-t-sm overflow-hidden flex items-end h-28">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 group-hover:brightness-125 transition-all rounded-t-sm"
                      />
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono truncate w-full text-center">
                      {stmt.periodMonth.slice(0, 3)}
                    </span>

                    {/* Tooltip */}
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 pointer-events-none whitespace-nowrap z-20">
                      {stmt.totalLicensesSold} sales (${stmt.contributorNetUSD.toFixed(0)})
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section: Photos That Have Sold - Leaderboard & Detail Inspector */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span>Top Performing Assets & License Breakdown</span>
                <span className="text-[11px] text-slate-400">({salesAssets.length} active earning items)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Inspect which exact photos generated sales, quantities sold, and buyer demographic channels
              </p>
            </div>

            {/* Sorting & Filter controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setSortBy('earnings')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    sortBy === 'earnings' ? 'bg-slate-800 text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  By Earnings ($)
                </button>
                <button
                  onClick={() => setSortBy('quantity')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    sortBy === 'quantity' ? 'bg-slate-800 text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  By Quantity (Units)
                </button>
                <button
                  onClick={() => setSortBy('recent')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    sortBy === 'recent' ? 'bg-slate-800 text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Recently Sold
                </button>
              </div>
            </div>
          </div>

          {/* Grid of Sold Photos */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {salesAssets.map((asset) => {
              const isSelected = selectedAsset?.id === asset.id;
              return (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className={`bg-slate-900/60 border rounded-xl overflow-hidden cursor-pointer transition-all hover:border-cyan-500/50 ${
                    isSelected ? 'border-cyan-400 ring-1 ring-cyan-400/40 shadow-lg' : 'border-slate-800'
                  }`}
                >
                  {/* Photo Preview Thumbnail */}
                  <div className="relative h-44 bg-slate-950 overflow-hidden">
                    <img
                      src={asset.thumbnailUrl}
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] font-mono text-cyan-300 border border-white/10">
                      {asset.gettyId}
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] font-medium text-emerald-300 border border-white/10">
                      {asset.collection}
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[10px] font-mono text-amber-300">
                      {asset.totalQuantitySold} copies sold
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-3">
                    <h4 className="text-xs font-semibold text-slate-100 line-clamp-1" title={asset.title}>
                      {asset.title}
                    </h4>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                        <div className="text-[10px] text-slate-400">Net Royalty</div>
                        <div className="font-mono font-bold text-emerald-400 tabular-nums">
                          ${asset.netRoyaltyUSD.toFixed(2)}
                        </div>
                      </div>
                      <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                        <div className="text-[10px] text-slate-400">Average RPD</div>
                        <div className="font-mono font-bold text-slate-200 tabular-nums">
                          ${asset.averageRoyaltyPerDownload.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                      <span>Last sold: {asset.lastLicensedDate}</span>
                      <span className="text-cyan-400 flex items-center gap-0.5 hover:underline">
                        Details <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Asset Deep Breakdown Drawer */}
        {selectedAsset && (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 shrink-0">
                  <img
                    src={selectedAsset.thumbnailUrl}
                    alt={selectedAsset.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">{selectedAsset.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="font-mono text-cyan-400">{selectedAsset.gettyId}</span>
                    <span>·</span>
                    <span>{selectedAsset.category}</span>
                    <span>·</span>
                    <span>Uploaded: {selectedAsset.uploadDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Total Net Royalties</div>
                  <div className="text-lg font-bold font-mono text-emerald-400">
                    ${selectedAsset.netRoyaltyUSD.toFixed(2)} USD
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Top Buyer Geographies */}
              <div className="p-4 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Top Buying Countries</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedAsset.topBuyerCountries.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Driving Keywords */}
              <div className="p-4 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span>Converting Keywords</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedAsset.keywords.slice(0, 5).map((k, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              {/* Camera & Tech Specs */}
              <div className="p-4 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <Camera className="w-4 h-4 text-purple-400" />
                  <span>Original Camera Specification</span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-0.5 font-mono">
                  <div>Body: {selectedAsset.camera}</div>
                  <div>Resolution: {selectedAsset.resolution}</div>
                  <div>Settings: {selectedAsset.shutter} · {selectedAsset.aperture} · ISO {selectedAsset.iso}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
