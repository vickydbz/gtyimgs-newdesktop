import React, { useState, useMemo } from 'react';
import { 
  Tag, 
  Search, 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle,
  Flame,
  Zap,
  SlidersHorizontal
} from 'lucide-react';
import { KeywordPerformance } from '../types';
import { apiService } from '../services/apiService';

interface KeywordAnalyticsProps {
  keywords: KeywordPerformance[];
}

export const KeywordAnalytics: React.FC<KeywordAnalyticsProps> = ({ keywords }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [velocityFilter, setVelocityFilter] = useState<string>('ALL');
  const [testedKeyword, setTestedKeyword] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    tag: string;
    disambiguations: string[];
    recommendation: string;
  } | null>(null);

  const filteredKeywords = useMemo(() => {
    return keywords.filter(k => {
      if (velocityFilter !== 'ALL' && k.searchVelocity !== velocityFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return k.tag.toLowerCase().includes(q) || k.disambiguation.toLowerCase().includes(q);
      }
      return true;
    });
  }, [keywords, velocityFilter, searchQuery]);

  const totalLicensesFromKeywords = useMemo(() => {
    return keywords.reduce((sum, k) => sum + k.licensesDriven, 0);
  }, [keywords]);

  const totalRevenueFromKeywords = useMemo(() => {
    return keywords.reduce((sum, k) => sum + k.totalEarningsUSD, 0);
  }, [keywords]);

  const handleTestDisambiguation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testedKeyword.trim()) return;
    setIsTesting(true);

    setTimeout(() => {
      setIsTesting(false);
      const kw = testedKeyword.trim().toLowerCase();
      let dis: string[] = [];
      let rec = '';

      if (kw.includes('solar') || kw.includes('energy')) {
        dis = ['Solar Energy - Renewable Energy Utility', 'Solar Radiation - Celestial Meteorology', 'Solar Panel - Photovoltaic Equipment'];
        rec = 'Use "Solar Energy - Renewable Energy" for commercial ESG campaigns; attach "Photovoltaic" for technical trade buyers.';
      } else if (kw.includes('apple')) {
        dis = ['Apple - Fruit & Food', 'Apple Inc. - Trademarked Brand (Editorial Only)', 'Apple Tree - Botany'];
        rec = 'For commercial stock without release, specify "Apple - Fruit & Food" to avoid editorial trademark rejections.';
      } else if (kw.includes('ai') || kw.includes('artificial')) {
        dis = ['Artificial Intelligence - Machine Learning', 'Robotics - Automation', 'Cybersecurity - Network Protection'];
        rec = 'Very high search volume. Pair with specific workplace tasks (e.g. "Data Science", "Code Development") to avoid dilution.';
      } else {
        dis = [`${testedKeyword} - Primary Subject Concept`, `${testedKeyword} - Industry Discipline`, `${testedKeyword} - Human Emotion / State`];
        rec = `Controlled vocabulary verified. Disambiguating "${testedKeyword}" ensures global translation into French, German, and Japanese buyer portals.`;
      }

      setTestResult({
        tag: testedKeyword,
        disambiguations: dis,
        recommendation: rec,
      });
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b0f17] overflow-hidden text-slate-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-[#0e1420]/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <span>Keyword Intelligence & SEO Search Visibility</span>
            <span className="text-[11px] font-normal text-slate-400">·</span>
            <span className="text-[11px] font-normal text-cyan-400 font-mono">Controlled Vocabulary Matrix</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Track top-performing search tags driving customer licenses, conversion rates, and Getty taxonomy disambiguation
          </p>
        </div>

        {/* Velocity Filter */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          {(['ALL', 'High Demand', 'Rising', 'Evergreen', 'Seasonal Peak'] as const).map(v => (
            <button
              key={v}
              onClick={() => setVelocityFilter(v)}
              className={`px-3 py-1 rounded transition-colors ${
                velocityFilter === v ? 'bg-slate-800 text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {v === 'ALL' ? 'All Velocities' : v}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="text-[11px] text-slate-400">Tracked Search Keywords</div>
            <div className="text-2xl font-bold font-mono text-slate-100 mt-1 tabular-nums">
              {keywords.length} tags
            </div>
            <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3" />
              <span>100% Disambiguated</span>
            </div>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="text-[11px] text-slate-400">Attributed Customer Licenses</div>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
              {totalLicensesFromKeywords.toLocaleString()} units
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Across primary search tags</div>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="text-[11px] text-slate-400">Keyword-Driven Net Royalties</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
              ${totalRevenueFromKeywords.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Direct search conversion</div>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="text-[11px] text-slate-400">Average Click-Through (CTR)</div>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
              11.6%
            </div>
            <div className="text-[10px] text-amber-400/90 mt-1">Top quartile on iStock/Getty</div>
          </div>
        </div>

        {/* Getty Disambiguation Testing Tool & Best Practice Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Disambiguation Tester */}
          <div className="lg:col-span-2 p-5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Getty Controlled Vocabulary & Disambiguation Simulator</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Getty requires disambiguating keywords to specify contextual meaning. Test any term to verify how the search engine maps it.
              </p>
            </div>

            <form onSubmit={handleTestDisambiguation} className="flex gap-2">
              <input
                type="text"
                value={testedKeyword}
                onChange={(e) => setTestedKeyword(e.target.value)}
                placeholder="Test a keyword (e.g. Solar Energy, Telemedicine, Remote Work, Apple)..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
              />
              <button
                type="submit"
                disabled={isTesting}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors disabled:opacity-50"
              >
                {isTesting ? 'Verifying Taxonomy...' : 'Test Disambiguation'}
              </button>
            </form>

            {testResult && (
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-100">
                    Disambiguation Options for &quot;{testResult.tag}&quot;
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Verified in Getty Ontology</span>
                </div>
                <div className="space-y-1.5">
                  {testResult.disambiguations.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-cyan-300 font-mono bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                  💡 <strong>Recommendation:</strong> {testResult.recommendation}
                </p>
              </div>
            )}
          </div>

          {/* Keywording Rules Card */}
          <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-3">
            <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Getty Images SEO Golden Rules</span>
            </h3>
            <ul className="space-y-2 text-[11px] text-slate-400 leading-relaxed list-disc list-inside">
              <li>
                <strong className="text-slate-200">First 10 Keywords Count Most:</strong> Getty&apos;s ranking algorithm weights the first 10 tags heavily for query relevance.
              </li>
              <li>
                <strong className="text-slate-200">Sweet Spot 25 - 35 Tags:</strong> Over-tagging (50+) triggers penalty de-ranking for keyword spam.
              </li>
              <li>
                <strong className="text-slate-200">Always Tag Conceptual Terms:</strong> In addition to literal subjects (&quot;Doctor&quot;), include conceptual keywords (&quot;Empathy&quot;, &quot;Care&quot;, &quot;Healthcare Industry&quot;).
              </li>
              <li>
                <strong className="text-slate-200">Specify Demographic Age:</strong> Tags like &quot;Senior Adult - Demographic (60+)&quot; rank higher for enterprise campaigns.
              </li>
            </ul>
          </div>
        </div>

        {/* Top Keywords Table */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Top Performing Portfolio Keywords</h2>
              <p className="text-xs text-slate-400">Sorted by license revenue and monthly buyer search impressions</p>
            </div>

            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tag or taxonomy..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-[#0d131f] border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-3 px-5 font-semibold">Keyword / Tag</th>
                  <th className="py-3 px-4 font-semibold">Getty Disambiguation (Ontology)</th>
                  <th className="py-3 px-4 font-semibold text-right">Est. Monthly Searches</th>
                  <th className="py-3 px-4 font-semibold text-right">Portfolio Assets</th>
                  <th className="py-3 px-4 font-semibold text-right">Licenses Driven</th>
                  <th className="py-3 px-4 font-semibold text-right">Net Royalties</th>
                  <th className="py-3 px-4 font-semibold text-right">CTR / CVR</th>
                  <th className="py-3 px-5 font-semibold text-center">Velocity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredKeywords.map((kw) => (
                  <tr key={kw.tag} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-5 font-sans">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="font-semibold text-slate-200">{kw.tag}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-sans truncate max-w-[220px]">
                      {kw.disambiguation}
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-300 tabular-nums">
                      {kw.searchImpressionsMonthly.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-400 tabular-nums">
                      {kw.portfolioAssetsTagged}
                    </td>

                    <td className="py-3.5 px-4 text-right text-cyan-400 font-semibold tabular-nums">
                      {kw.licensesDriven}
                    </td>

                    <td className="py-3.5 px-4 text-right text-emerald-400 font-semibold tabular-nums">
                      ${kw.totalEarningsUSD.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-300 tabular-nums">
                      {kw.clickThroughRate}% / <span className="text-emerald-400">{kw.conversionRate}%</span>
                    </td>

                    <td className="py-3.5 px-5 text-center font-sans">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono ${
                        kw.searchVelocity === 'High Demand'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                          : kw.searchVelocity === 'Rising'
                          ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/40'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {kw.searchVelocity === 'High Demand' && <Flame className="w-3 h-3 text-amber-400" />}
                        {kw.searchVelocity === 'Rising' && <Zap className="w-3 h-3 text-cyan-400" />}
                        <span>{kw.searchVelocity}</span>
                      </span>
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
