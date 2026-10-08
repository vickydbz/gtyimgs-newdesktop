import React, { useState, useMemo } from 'react';
import { 
  Globe, 
  MapPin, 
  TrendingUp, 
  Search, 
  ArrowUpRight, 
  DollarSign, 
  Layers, 
  Compass, 
  Sparkles 
} from 'lucide-react';
import { CountrySalesData, ContributorProfile } from '../types';

interface GlobalSalesMapProps {
  countrySales: CountrySalesData[];
  profile: ContributorProfile;
}

export const GlobalSalesMap: React.FC<GlobalSalesMapProps> = ({
  countrySales,
  profile,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountrySalesData>(countrySales[0]);

  const filteredCountries = useMemo(() => {
    return countrySales.filter(c => {
      if (selectedRegion !== 'ALL' && c.region !== selectedRegion) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return c.countryName.toLowerCase().includes(q) || c.countryCode.toLowerCase().includes(q);
      }
      return true;
    });
  }, [countrySales, selectedRegion, searchQuery]);

  const totalGlobalLicenses = useMemo(() => {
    return countrySales.reduce((acc, c) => acc + c.licensesSold, 0);
  }, [countrySales]);

  const totalGlobalNetEarnings = useMemo(() => {
    return countrySales.reduce((acc, c) => acc + c.netEarningsUSD, 0);
  }, [countrySales]);

  // Regional breakdown
  const regionalStats = useMemo(() => {
    const map: Record<string, { count: number; earnings: number; licenses: number }> = {};
    countrySales.forEach(c => {
      if (!map[c.region]) map[c.region] = { count: 0, earnings: 0, licenses: 0 };
      map[c.region].count += 1;
      map[c.region].earnings += c.netEarningsUSD;
      map[c.region].licenses += c.licensesSold;
    });
    return Object.entries(map).map(([region, data]) => ({
      region,
      share: ((data.earnings / totalGlobalNetEarnings) * 100).toFixed(1),
      licenses: data.licenses,
      earnings: data.earnings,
    })).sort((a, b) => parseFloat(b.share) - parseFloat(a.share));
  }, [countrySales, totalGlobalNetEarnings]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b0f17] overflow-hidden text-slate-200">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-[#0e1420]/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <span>Global Sales & Buyer Territory Distribution</span>
            <span className="text-[11px] font-normal text-slate-400">·</span>
            <span className="text-[11px] font-normal text-cyan-400 font-mono">48 Active Nations</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Geographic intelligence detailing where your stock licenses are purchased worldwide
          </p>
        </div>

        {/* Region Filter */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          {(['ALL', 'North America', 'Europe', 'Asia-Pacific', 'Latin America'] as const).map(reg => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1 rounded transition-colors ${
                selectedRegion === reg ? 'bg-slate-800 text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {reg === 'ALL' ? 'All Territories' : reg}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* World Map & Geo Spotlight Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Vector World Map */}
          <div className="lg:col-span-2 p-5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-100">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Global Licensing Heatmap</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Click country node to inspect buyer behavior
              </div>
            </div>

            {/* Stylized Vector World Map Canvas */}
            <div className="relative w-full h-64 bg-[#0a0e16] border border-slate-800/80 rounded-lg overflow-hidden flex items-center justify-center p-4">
              <svg 
                viewBox="0 0 1000 500" 
                className="w-full h-full select-none"
              >
                {/* Simplified Continents Graphic */}
                <path
                  d="M150,120 Q180,80 250,90 Q300,100 320,150 Q310,210 270,230 Q220,240 170,220 Q130,190 150,120 Z"
                  fill="#1e293b"
                  opacity="0.6"
                />
                <path
                  d="M260,260 Q290,250 320,290 Q340,360 310,430 Q280,450 250,400 Q230,320 260,260 Z"
                  fill="#1e293b"
                  opacity="0.6"
                />
                <path
                  d="M480,90 Q540,70 580,110 Q570,160 520,180 Q470,160 480,90 Z"
                  fill="#1e293b"
                  opacity="0.6"
                />
                <path
                  d="M470,200 Q560,190 580,260 Q570,360 510,400 Q460,340 450,260 Q450,210 470,200 Z"
                  fill="#1e293b"
                  opacity="0.6"
                />
                <path
                  d="M600,80 Q780,60 850,130 Q880,220 780,260 Q670,240 600,180 Z"
                  fill="#1e293b"
                  opacity="0.6"
                />
                <path
                  d="M780,320 Q860,310 880,370 Q850,420 790,410 Q760,370 780,320 Z"
                  fill="#1e293b"
                  opacity="0.6"
                />

                {/* Interactive Country Pins */}
                {countrySales.map((c) => {
                  // Coordinate to SVG projection approximation
                  const cx = ((c.lng + 180) / 360) * 960 + 20;
                  const cy = ((90 - c.lat) / 180) * 440 + 30;
                  const radius = Math.max(5, Math.min(16, (c.licensesSold / 1480) * 16));
                  const isCurrent = selectedCountry.countryCode === c.countryCode;

                  return (
                    <g 
                      key={c.countryCode} 
                      className="cursor-pointer group"
                      onClick={() => setSelectedCountry(c)}
                    >
                      {/* Pulsing ring for top market */}
                      {c.countryCode === 'US' && (
                        <circle cx={cx} cy={cy} r={radius * 1.8} fill="#06b6d4" opacity="0.15" className="animate-ping" />
                      )}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={radius}
                        fill={isCurrent ? '#38bdf8' : '#0891b2'}
                        stroke={isCurrent ? '#ffffff' : '#0e7490'}
                        strokeWidth={isCurrent ? 2 : 1}
                        opacity={isCurrent ? 1 : 0.85}
                        className="transition-all hover:scale-125"
                      />
                      <text
                        x={cx}
                        y={cy - radius - 4}
                        fill="#f8fafc"
                        fontSize="9"
                        textAnchor="middle"
                        fontFamily="monospace"
                        className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      >
                        {c.countryName} ({c.sharePercent}%)
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="absolute bottom-2 right-3 text-[10px] text-slate-500 font-mono">
                Projection: Equirectangular · GeoJSON Normalized
              </div>
            </div>

            {/* Region Share Progress Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {regionalStats.map(r => (
                <div key={r.region} className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 truncate">{r.region}</div>
                  <div className="text-sm font-bold text-slate-100 font-mono mt-0.5 tabular-nums">
                    {r.share}%
                  </div>
                  <div className="text-[10px] text-cyan-400 mt-0.5 font-mono">
                    {r.licenses} licenses
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Spotlight Card for Selected Country */}
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold font-mono text-xs">
                  {selectedCountry.countryCode}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">{selectedCountry.countryName}</h3>
                  <div className="text-[11px] text-slate-400">{selectedCountry.region}</div>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                +{selectedCountry.growthRateYoY}% YoY
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <div className="text-[10px] text-slate-400">Total Net Contributor Royalties</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5 tabular-nums">
                  ${selectedCountry.netEarningsUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Gross Billings: ${selectedCountry.grossSalesUSD.toLocaleString()} USD
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <div className="text-[10px] text-slate-400">Licenses Sold</div>
                  <div className="text-base font-bold font-mono text-slate-100 mt-0.5 tabular-nums">
                    {selectedCountry.licensesSold}
                  </div>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <div className="text-[10px] text-slate-400">Portfolio Share</div>
                  <div className="text-base font-bold font-mono text-cyan-400 mt-0.5 tabular-nums">
                    {selectedCountry.sharePercent}%
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-1">
                <div className="text-[10px] text-slate-400">Top Selling Category in this Market</div>
                <div className="text-xs font-semibold text-slate-200">
                  {selectedCountry.topSellingCategory}
                </div>
                <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                  Buyers in {selectedCountry.countryName} exhibit high conversion on modern corporate lifestyle, clean energy sustainability, and unposed documentary styles.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Country Leaderboard Table */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Global Country Ranking & License Performance</h2>
              <p className="text-xs text-slate-400">Ranked by total licensing volume and net royalties earned</p>
            </div>

            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by country or code..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-[#0d131f] border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-3 px-5 font-semibold">Rank & Territory</th>
                  <th className="py-3 px-4 font-semibold">Region</th>
                  <th className="py-3 px-4 font-semibold text-right">Licenses Sold</th>
                  <th className="py-3 px-4 font-semibold text-right">Gross Sales</th>
                  <th className="py-3 px-4 font-semibold text-right">Net Royalties</th>
                  <th className="py-3 px-4 font-semibold text-right">Share %</th>
                  <th className="py-3 px-4 font-semibold text-right">YoY Velocity</th>
                  <th className="py-3 px-5 font-semibold">Top Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredCountries.map((c, idx) => (
                  <tr
                    key={c.countryCode}
                    onClick={() => setSelectedCountry(c)}
                    className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                      selectedCountry.countryCode === c.countryCode ? 'bg-slate-800/60' : ''
                    }`}
                  >
                    <td className="py-3 px-5 font-sans">
                      <div className="flex items-center gap-2.5">
                        <span className="text-slate-500 text-[11px] font-mono w-4">{idx + 1}</span>
                        <span className="w-6 h-4 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono text-cyan-300">
                          {c.countryCode}
                        </span>
                        <span className="font-medium text-slate-200">{c.countryName}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-400 font-sans">{c.region}</td>

                    <td className="py-3 px-4 text-right text-slate-200 tabular-nums">
                      {c.licensesSold.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-right text-slate-400 tabular-nums">
                      ${c.grossSalesUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 px-4 text-right font-semibold text-emerald-400 tabular-nums">
                      ${c.netEarningsUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 px-4 text-right text-cyan-400 tabular-nums">
                      {c.sharePercent}%
                    </td>

                    <td className="py-3 px-4 text-right font-sans">
                      <span className="text-emerald-400 text-[11px] font-mono">
                        +{c.growthRateYoY}%
                      </span>
                    </td>

                    <td className="py-3 px-5 text-slate-300 font-sans truncate max-w-[160px]">
                      {c.topSellingCategory}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
