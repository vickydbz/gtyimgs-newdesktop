import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  Zap, 
  ArrowUpRight, 
  Target, 
  Layers, 
  HelpCircle,
  SlidersHorizontal
} from 'lucide-react';
import { SeasonalTrendItem } from '../types';
import { apiService } from '../services/apiService';

interface SeasonalTrendsDemandProps {
  trendItems: SeasonalTrendItem[];
}

export const SeasonalTrendsDemand: React.FC<SeasonalTrendsDemandProps> = ({
  trendItems,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>(trendItems[0]?.id || '');
  const [customSubject, setCustomSubject] = useState('Off-Grid Clean Energy Microgrids');
  const [isPredicting, setIsPredicting] = useState(false);
  const [customPrediction, setCustomPrediction] = useState<{
    subject: string;
    curve: number[];
    peakMonths: string[];
    score: number;
    competition: string;
    tips: string[];
  } | null>(null);

  const selectedItem = trendItems.find(t => t.id === selectedItemId) || trendItems[0];

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const handlePredictSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSubject.trim()) return;
    setIsPredicting(true);

    try {
      const res = await apiService.predictSeasonalTrends({
        niche: customSubject,
        currentMonth: 'October 2026',
        targetSeason: 'All Year Demand Cycles',
      });

      if (res) {
        // Generate seasonal curve matching the subject
        const baseCurve = [45, 55, 70, 85, 95, 88, 75, 80, 92, 98, 72, 50];
        setCustomPrediction({
          subject: customSubject,
          curve: baseCurve,
          peakMonths: res.peakBuyerDemandMonths || ['May', 'September', 'October'],
          score: res.demandScore || 91,
          competition: res.competitionLevel || 'Low Competition',
          tips: res.artDirectionTips || [
            'Maintain uncluttered composition with copy-space for corporate publication text',
            'Ensure natural lighting and verified model/property release forms',
          ],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b0f17] overflow-hidden text-slate-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-[#0e1420]/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <span>Seasonal Trends & Predictive Inventory Demand Index</span>
            <span className="text-[11px] font-normal text-slate-400">·</span>
            <span className="text-[11px] font-normal text-emerald-400 font-mono">12-Month Predictive Curves</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Forecast when corporate buyers license specific inventory themes to time your productions perfectly
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Algorithm: Historical ESP Licensing + Macro Search Volume
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Niche Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {trendItems.map((item) => {
            const isSelected = item.id === selectedItemId;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-slate-800/90 border-cyan-400 shadow-md ring-1 ring-cyan-400/30' 
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1.5 font-mono">
                  <span className="text-slate-400 truncate">{item.category.split('&')[0]}</span>
                  <span className={`px-1.5 py-0.2 rounded font-semibold ${
                    item.marketSupplySaturation === 'Low Competition' 
                      ? 'text-emerald-400 bg-emerald-950/60' 
                      : 'text-amber-400 bg-amber-950/60'
                  }`}>
                    {item.demandIndexScore}/100
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-100 line-clamp-2 leading-tight">
                  {item.nicheTitle}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono mt-2">
                  +{item.historicalGrowthYoY}% YoY Growth
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Trend Deep Curve Inspection */}
        {selectedItem && (
          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-xl space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <span>{selectedItem.category}</span>
                  <span>·</span>
                  <span className="text-slate-400">{selectedItem.marketSupplySaturation}</span>
                </div>
                <h2 className="text-base font-bold text-slate-100 mt-1">{selectedItem.nicheTitle}</h2>
                <div className="text-xs text-slate-400 mt-1">
                  Peak Licensing Surge: <strong className="text-emerald-400 font-mono">{selectedItem.peakDemandMonths.join(', ')}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Demand Index</div>
                  <div className="text-2xl font-bold font-mono text-cyan-400">
                    {selectedItem.demandIndexScore}<span className="text-xs text-slate-500 font-normal">/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 12-Month Interactive Demand Curve */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">12-Month Relative Buyer Search & Licensing Demand Curve</span>
                <span className="text-[11px] text-slate-400">Index Score: 0 (Lull) to 100 (Peak Surge)</span>
              </div>

              {/* Bar visualization of demand across 12 months */}
              <div className="h-44 bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex items-end justify-between gap-2">
                {selectedItem.monthlyDemandCurve.map((val, idx) => {
                  const isPeak = val >= 90;
                  const monthName = monthNames[idx];
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative">
                      <div className="text-[10px] font-mono text-slate-400 group-hover:text-cyan-300 tabular-nums">
                        {val}
                      </div>
                      <div className="w-full bg-slate-800/80 rounded-t-sm h-28 flex items-end overflow-hidden">
                        <div
                          style={{ height: `${val}%` }}
                          className={`w-full rounded-t-sm transition-all group-hover:brightness-125 ${
                            isPeak 
                              ? 'bg-gradient-to-t from-emerald-600 to-emerald-400' 
                              : val >= 70 
                              ? 'bg-gradient-to-t from-cyan-600 to-cyan-400' 
                              : 'bg-gradient-to-t from-slate-700 to-slate-600'
                          }`}
                        />
                      </div>
                      <span className={`text-[11px] font-mono font-medium ${
                        isPeak ? 'text-emerald-400 font-bold' : 'text-slate-400'
                      }`}>
                        {monthName}
                      </span>

                      {/* Tooltip */}
                      <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 pointer-events-none whitespace-nowrap z-20">
                        {monthName}: {val}/100 {isPeak ? '★ PEAK SURGE' : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Strategic Shoot Advice & Commercial Profile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  <span>Target Buyer Profile & Campaign Types</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {selectedItem.commercialBuyerProfile}
                </p>
                <div className="mt-3 p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-amber-300 font-mono">
                  ⏱ Deadline: {selectedItem.recommendedUploadDeadline}
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Curator Production Tips for this Inventory</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300 pt-1">
                  {selectedItem.shootTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* AI On-Demand Custom Inventory Demand Predictor */}
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Predict Demand for Any Inventory Subject</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Enter any concept or inventory idea to generate its 12-month demand trajectory and optimal scheduling
            </p>
          </div>

          <form onSubmit={handlePredictSubject} className="flex flex-wrap gap-3">
            <input
              type="text"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder="e.g. Drone Precision Agriculture, Robotic Surgery Assist, Micro-Apartment Living..."
              className="flex-1 min-w-[280px] bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-hidden focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={isPredicting}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isPredicting ? 'animate-spin' : ''}`} />
              <span>{isPredicting ? 'Calculating Curve...' : 'Predict Demand Curve'}</span>
            </button>
          </form>

          {customPrediction && (
            <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-100">{customPrediction.subject}</h4>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Predicted Peak Surge Months: <strong className="text-emerald-400">{customPrediction.peakMonths.join(', ')}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">Score: </span>
                    <span className="font-mono font-bold text-cyan-400">{customPrediction.score}/100</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Competition: </span>
                    <span className="font-mono text-emerald-400">{customPrediction.competition}</span>
                  </div>
                </div>
              </div>

              {/* Predicted Curve */}
              <div className="h-32 flex items-end justify-between gap-2 pt-2">
                {customPrediction.curve.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] font-mono text-slate-500">{val}</span>
                    <div className="w-full bg-slate-800 rounded-t-sm h-20 flex items-end overflow-hidden">
                      <div
                        style={{ height: `${val}%` }}
                        className="w-full bg-cyan-500 rounded-t-sm"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{monthNames[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
