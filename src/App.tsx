import React, { useState } from 'react';
import { 
  BarChart3, 
  Upload, 
  FileText, 
  Globe, 
  FileBarChart, 
  Tag, 
  Compass, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  ShieldCheck, 
  SlidersHorizontal,
  FolderSync,
  Layers
} from 'lucide-react';
import { 
  PlatformMode, 
  ActiveTab, 
  ContributorProfile, 
  StockAsset, 
  RoyaltyStatement, 
  CountrySalesData, 
  KeywordPerformance, 
  IndustryEvent, 
  SeasonalTrendItem 
} from './types';
import { 
  initialContributorProfile, 
  initialStockAssets, 
  initialRoyaltyStatements, 
  initialCountrySales, 
  initialKeywords, 
  initialIndustryEvents, 
  initialSeasonalTrends 
} from './data/mockData';
import { DesktopWindowChrome } from './components/DesktopWindowChrome';
import { LoginModal } from './components/LoginModal';
import { GettyApiGuideModal } from './components/GettyApiGuideModal';
import { PortingGuideModal } from './components/PortingGuideModal';
import { SalesDashboard } from './components/SalesDashboard';
import { UploadStudio } from './components/UploadStudio';
import { RoyaltiesLedger } from './components/RoyaltiesLedger';
import { GlobalSalesMap } from './components/GlobalSalesMap';
import { SalesReports } from './components/SalesReports';
import { KeywordAnalytics } from './components/KeywordAnalytics';
import { SeasonalOptimizer } from './components/SeasonalOptimizer';
import { IndustryEventsCalendar } from './components/IndustryEventsCalendar';
import { SeasonalTrendsDemand } from './components/SeasonalTrendsDemand';

export default function App() {
  const [platform, setPlatform] = useState<PlatformMode>('windows');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [profile, setProfile] = useState<ContributorProfile>(initialContributorProfile);
  const [assets, setAssets] = useState<StockAsset[]>(initialStockAssets);
  const [statements, setStatements] = useState<RoyaltyStatement[]>(initialRoyaltyStatements);
  const [countrySales, setCountrySales] = useState<CountrySalesData[]>(initialCountrySales);
  const [keywords, setKeywords] = useState<KeywordPerformance[]>(initialKeywords);
  const [events, setEvents] = useState<IndustryEvent[]>(initialIndustryEvents);
  const [trendItems, setTrendItems] = useState<SeasonalTrendItem[]>(initialSeasonalTrends);

  // Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isApiGuideOpen, setIsApiGuideOpen] = useState(false);
  const [isPortingGuideOpen, setIsPortingGuideOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const handleToggleExclusive = () => {
    const isNowExclusive = profile.tier !== 'Exclusive';
    setProfile(prev => ({
      ...prev,
      tier: isNowExclusive ? 'Exclusive' : 'Non-Exclusive',
      royaltyRate: isNowExclusive ? '40% (Exclusive Signature Tier)' : '20% (Non-Exclusive Essentials Tier)',
    }));
  };

  const handleAddAsset = (newAsset: StockAsset) => {
    setAssets(prev => [newAsset, ...prev]);
  };

  const handleUpdateAsset = (updatedAsset: StockAsset) => {
    setAssets(prev => prev.map(a => a.id === updatedAsset.id ? updatedAsset : a));
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const handleAddEventToQueue = (evt: IndustryEvent) => {
    const draftAsset: StockAsset = {
      id: `evt-queue-${Date.now()}`,
      gettyId: `PLAN-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `${evt.title} Production Target`,
      description: evt.description,
      category: 'Technology & AI',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      uploadDate: new Date().toISOString().split('T')[0],
      resolution: '9504 x 6336 (60.2 MP)',
      aspectRatio: '3:2 Landscape',
      fileSizeMB: 28.0,
      camera: 'Sony Alpha 1',
      lens: 'FE 24-70mm F2.8 GM II',
      iso: 100,
      shutter: '1/250s',
      aperture: 'f/2.8',
      colorSpace: 'Adobe RGB',
      licenseType: 'Creative RF',
      collection: 'Getty Images Creative',
      modelRelease: 'Pending',
      propertyRelease: 'Signed & Verified',
      keywords: evt.recommendedKeywords,
      disambiguatedKeywords: evt.recommendedKeywords.map(k => ({
        tag: k,
        disambiguation: `${k} - Controlled Vocabulary`,
      })),
      status: 'draft',
      totalQuantitySold: 0,
      grossSalesUSD: 0,
      netRoyaltyUSD: 0,
      averageRoyaltyPerDownload: 0,
      lastLicensedDate: '—',
      topBuyerCountries: [],
    };
    handleAddAsset(draftAsset);
    setActiveTab('upload');
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Sales & Earnings', icon: BarChart3 },
    { id: 'upload', label: 'Upload & Submit', icon: Upload, badge: 'ESP v3' },
    { id: 'royalties', label: 'Royalty Documents', icon: FileText, badge: '24 Mo' },
    { id: 'geo', label: 'Global Sales (Geo)', icon: Globe },
    { id: 'reports', label: 'Sales Reports', icon: FileBarChart },
    { id: 'keywords', label: 'Keywords & SEO', icon: Tag },
    { id: 'seasonal', label: 'Season Schedules', icon: Compass },
    { id: 'events', label: 'Industry Calendar', icon: CalendarIcon, badge: 'Golden' },
    { id: 'trends', label: 'Demand Index', icon: TrendingUp },
  ];

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden bg-[#0a0e16] text-slate-100 ${
      platform === 'macos' ? 'font-sans' : 'font-sans'
    }`}>
      {/* Top Desktop Frame Chrome (Supports Windows 11 Fluent or Apple macOS Glass styles) */}
      <DesktopWindowChrome
        platform={platform}
        setPlatform={setPlatform}
        profile={profile}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenPortingGuide={() => setIsPortingGuideOpen(true)}
        onOpenApiGuide={() => setIsApiGuideOpen(true)}
        onToggleExclusive={handleToggleExclusive}
        onRefreshData={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Desktop Sidebar Navigation */}
        <aside className="w-60 bg-[#0d121c] border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
          {/* Nav Links */}
          <div className="p-3 space-y-1 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Contributor Studio
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 font-semibold shadow-xs border-l-2 border-cyan-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-medium ${
                      isActive 
                        ? 'bg-cyan-500/20 text-cyan-300' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Account & Payout Telemetry Card */}
          <div className="p-3 border-t border-slate-800 bg-[#0b0f17]">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Unpaid ESP Balance</span>
                <span className="text-emerald-400 font-mono font-semibold">Active</span>
              </div>
              <div className="text-base font-bold font-mono text-slate-100 tabular-nums">
                ${profile.unpaidBalanceUSD.toFixed(2)} USD
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                <span>Next Disbursement:</span>
                <span className="text-amber-400 font-mono">{profile.nextPayoutDate.slice(5)}</span>
              </div>
            </div>

            <div className="mt-2 text-[10px] text-slate-500 text-center font-mono">
              Shortcuts: {platform === 'macos' ? '⌘1–⌘9 to switch tabs' : 'Ctrl+1–Ctrl+9 to switch tabs'}
            </div>
          </div>
        </aside>

        {/* Central Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#0b0f17]">
          {activeTab === 'dashboard' && (
            <SalesDashboard 
              assets={assets} 
              statements={statements} 
              profile={profile} 
            />
          )}

          {activeTab === 'upload' && (
            <UploadStudio
              assets={assets}
              onAddAsset={handleAddAsset}
              onUpdateAsset={handleUpdateAsset}
              onDeleteAsset={handleDeleteAsset}
              profile={profile}
            />
          )}

          {activeTab === 'royalties' && (
            <RoyaltiesLedger
              statements={statements}
              profile={profile}
            />
          )}

          {activeTab === 'geo' && (
            <GlobalSalesMap
              countrySales={countrySales}
              profile={profile}
            />
          )}

          {activeTab === 'reports' && (
            <SalesReports
              assets={assets}
              statements={statements}
              profile={profile}
            />
          )}

          {activeTab === 'keywords' && (
            <KeywordAnalytics
              keywords={keywords}
            />
          )}

          {activeTab === 'seasonal' && (
            <SeasonalOptimizer />
          )}

          {activeTab === 'events' && (
            <IndustryEventsCalendar
              events={events}
              onAddToQueue={handleAddEventToQueue}
            />
          )}

          {activeTab === 'trends' && (
            <SeasonalTrendsDemand
              trendItems={trendItems}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentProfile={profile}
        onUpdateProfile={setProfile}
      />

      <GettyApiGuideModal
        isOpen={isApiGuideOpen}
        onClose={() => setIsApiGuideOpen(false)}
      />

      <PortingGuideModal
        isOpen={isPortingGuideOpen}
        onClose={() => setIsPortingGuideOpen(false)}
      />
    </div>
  );
}
