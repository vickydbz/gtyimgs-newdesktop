import React, { useState } from 'react';
import { 
  Compass, 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Target, 
  Camera, 
  Sun, 
  Leaf, 
  Snowflake, 
  Flower2,
  Sliders
} from 'lucide-react';
import { apiService } from '../services/apiService';

export const SeasonalOptimizer: React.FC = () => {
  const [selectedSeason, setSelectedSeason] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q1');
  const [customNiche, setCustomNiche] = useState('Commercial Sustainable Energy & Architecture');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiStrategy, setAiStrategy] = useState<{
    recommendedUploadWindow: string;
    peakBuyerDemandMonths: string[];
    demandScore: number;
    competitionLevel: string;
    prioritySubjects: string[];
    topDisambiguatedKeywords: string[];
    artDirectionTips: string[];
    executiveSummary: string;
  } | null>(null);

  const handleGenerateCustomStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const result = await apiService.predictSeasonalTrends({
        niche: customNiche,
        currentMonth: 'October 2026',
        targetSeason: `Upcoming ${selectedSeason} Season`,
      });
      if (result) {
        setAiStrategy(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const seasonalPlaybooks = {
    Q1: {
      title: 'Q1 (Jan – Mar): New Year Intentions, Health Tech & Corporate Kickoffs',
      icon: Snowflake,
      status: 'URGENT: Upload Now',
      statusColor: 'text-amber-400 bg-amber-950/60 border-amber-800/40',
      uploadWindow: 'October 15 – November 30 (60-90 Days in Advance)',
      buyerDemandMonths: 'January, February, March',
      focusThemes: [
        'Active Aging & Medicare Digital Healthcare (Senior telemedicine, mental health)',
        'New Year Financial Budgeting & Wealth Tech (Retirement apps, ESG investment planning)',
        'Healthy Nutrition & Sustainable Meal Prep (Farm-to-table, plant-based diet)',
        'Corporate Annual Strategy & Agile Planning (Multi-ethnic teams around whiteboards)',
      ],
      artDirection: [
        'Soft morning winter daylight through tall windows; avoid harsh fluorescent flashes.',
        'High degree of authenticity: cast real subjects rather than overly posed fitness models.',
        'Preserve clean 16:9 copy-space on either side for corporate editorial web banners.',
      ],
      highValueKeywords: ['Resolution', 'Mindfulness', 'Personal Finance', 'Telehealth', 'Corporate Strategy'],
    },
    Q2: {
      title: 'Q2 (Apr – Jun): Spring Renewal, Green Tech, Outdoor Living & Mother’s Day',
      icon: Flower2,
      status: 'Planning Phase',
      statusColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/40',
      uploadWindow: 'January 10 – February 28',
      buyerDemandMonths: 'April, May, June',
      focusThemes: [
        'Urban Rooftop Gardening & Biodiversity (Hydroponics, pollinator friendly flowers)',
        'Residential Solar & Heat Pump Installations (Homeowners inspecting clean energy)',
        'Spring Cycling & Eco-Mobility (Electric commuter bikes, pedestrianized city centers)',
        'Multi-Generational Spring Gatherings & Family Celebrations',
      ],
      artDirection: [
        'Vibrant, fresh natural palette (lush sage greens, warm creams, sky blues).',
        'Candid movement: wind blowing through hair, natural laughter, unposed action.',
        'Document real tools and equipment with authentic wear and tear.',
      ],
      highValueKeywords: ['Spring Refresh', 'Renewable Energy', 'Gardening', 'Eco Friendly', 'Family Reunion'],
    },
    Q3: {
      title: 'Q3 (Jul – Sep): Summer Tourism, Alpine Recreation & Back-to-School',
      icon: Sun,
      status: 'Advance Production',
      statusColor: 'text-slate-400 bg-slate-900 border-slate-800',
      uploadWindow: 'March 15 – May 01',
      buyerDemandMonths: 'July, August, September',
      focusThemes: [
        'Sustainable Road Trips & Off-Grid EV Travel (Electric camper vans, backcountry trails)',
        'STEM Higher Education & Laboratory Science (Diverse students using robotic instruments)',
        'Outdoor Summer Hospitality (Farm dinners, seaside alfresco dining, zero single-use plastic)',
        'Summer Athletic Training & Ocean Water Sports',
      ],
      artDirection: [
        'Warm golden hour rim-light and blue hour ambient glow.',
        'Wide scenic environmental portraits that convey scale and freedom.',
        'Clean non-trademarked clothing with no visible commercial apparel logos.',
      ],
      highValueKeywords: ['Eco Tourism', 'Back to School', 'STEM Education', 'Alpine Lake', 'Electric Vehicle'],
    },
    Q4: {
      title: 'Q4 (Oct – Dec): Autumn Gastronomy, E-Commerce Surge & Winter Holidays',
      icon: Leaf,
      status: 'Annual Climax',
      statusColor: 'text-slate-400 bg-slate-900 border-slate-800',
      uploadWindow: 'June 15 – August 15',
      buyerDemandMonths: 'October, November, December',
      focusThemes: [
        'E-Commerce Fulfillment & Smart Logistics (Automated warehouse robotics, parcel delivery)',
        'Warm Autumn Harvest & Artisanal Baking (Sourdough bread, artisanal wine harvesting)',
        'Intimate Winter Celebrations & Gifting (Candlelit domestic gatherings, sustainable packaging)',
        'Corporate Year-End Retrospectives & Client Gratitude',
      ],
      artDirection: [
        'Rich, moody ambient tones with warm candlelight and amber incandescent practicals.',
        'Close-up macro textures (steam rising from dishes, tactile wrapping paper, wool knitwear).',
        'Cozy negative space for festive holiday text overlays and promotional banners.',
      ],
      highValueKeywords: ['Holiday Shopping', 'Autumn Harvest', 'Cozy Home', 'Delivery Logistics', 'Year End'],
    },
  };

  const activePlaybook = seasonalPlaybooks[selectedSeason];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b0f17] overflow-hidden text-slate-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-[#0e1420]/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <span>Future Season Optimization & Upload Playbooks</span>
            <span className="text-[11px] font-normal text-slate-400">·</span>
            <span className="text-[11px] font-normal text-cyan-400 font-mono">60-90 Day Lead Rule</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Stock buyers and advertising agencies license content 2 to 3 months prior to publication. Align your shoots with future demand curves.
          </p>
        </div>

        {/* Season Selector Tabs */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSelectedSeason(s)}
              className={`px-3 py-1 rounded transition-colors ${
                selectedSeason === s ? 'bg-slate-800 text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s} Strategy
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Core Stock Photography Principle Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-slate-900/40 border border-cyan-500/30 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
            <Clock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
              The Getty Images 60–90 Day Upload Rule
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              If you upload Christmas photos in December or Summer beach photos in July, you have already missed 85% of buyer licensing volume. 
              Enterprise ad agencies buy assets <strong>60 to 90 days before launch</strong> to design brochures, digital campaigns, and magazine spreads.
            </p>
          </div>
        </div>

        {/* Active Season Playbook Card */}
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
                <activePlaybook.icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-100">{activePlaybook.title}</h2>
                <div className="text-xs text-slate-400 mt-0.5">
                  Buyer surge occurs across: <strong className="text-slate-200">{activePlaybook.buyerDemandMonths}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded text-xs font-mono font-medium border ${activePlaybook.statusColor}`}>
                {activePlaybook.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority Shoot Themes */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                <span>Commercial Subjects in Highest Demand</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {activePlaybook.focusThemes.map((theme, i) => (
                  <li key={i} className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{theme}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Art Direction & Technical Standards */}
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Getty Art Direction & Composition Standards</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {activePlaybook.artDirection.map((tip, i) => (
                    <li key={i} className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 flex items-start gap-2.5">
                      <span className="text-amber-400 font-mono text-xs font-bold mt-0.5">#{i + 1}</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Controlled Keywords */}
              <div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-2">
                <div className="text-[11px] font-medium text-slate-400">High-Indexing Keywords to Tag:</div>
                <div className="flex flex-wrap gap-1.5">
                  {activePlaybook.highValueKeywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 font-mono">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Custom Niche Seasonal Strategy Generator */}
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Niche Strategy & Upload Schedule Generator</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Generate a personalized 90-day production timeline and keyword roadmap tailored to your specific photography specialty
            </p>
          </div>

          <form onSubmit={handleGenerateCustomStrategy} className="flex flex-wrap gap-3">
            <input
              type="text"
              value={customNiche}
              onChange={(e) => setCustomNiche(e.target.value)}
              placeholder="e.g. Drone Aerial Clean Energy, Senior Active Fitness, Minimalist Architecture..."
              className="flex-1 min-w-[280px] bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-hidden focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="px-4 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Analyzing Getty Demand...' : 'Generate Niche Strategy'}</span>
            </button>
          </form>

          {aiStrategy && (
            <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    Recommended Upload Window
                  </div>
                  <div className="text-sm font-semibold text-slate-100 mt-0.5 font-mono">
                    {aiStrategy.recommendedUploadWindow}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Demand Score: </span>
                    <span className="font-mono font-bold text-emerald-400">{aiStrategy.demandScore}/100</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Competition: </span>
                    <span className="font-mono text-cyan-400">{aiStrategy.competitionLevel}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic">
                &ldquo;{aiStrategy.executiveSummary}&rdquo;
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <div className="text-xs font-medium text-slate-200">High-Converting Priority Subjects:</div>
                  <ul className="space-y-1.5 text-[11px] text-slate-400">
                    {aiStrategy.prioritySubjects.map((sub, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-0.5">•</span>
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-slate-200">Art Direction & Commercial Rules:</div>
                  <ul className="space-y-1.5 text-[11px] text-slate-400">
                    {aiStrategy.artDirectionTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
