import React from 'react';
import { 
  Minus, 
  Square, 
  X, 
  Layers, 
  ShieldCheck, 
  HelpCircle, 
  LogOut, 
  User, 
  Sparkles,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { PlatformMode, ContributorProfile } from '../types';

interface DesktopWindowChromeProps {
  platform: PlatformMode;
  setPlatform: (p: PlatformMode) => void;
  profile: ContributorProfile;
  onOpenLogin: () => void;
  onOpenPortingGuide: () => void;
  onOpenApiGuide: () => void;
  onToggleExclusive: () => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
}

export const DesktopWindowChrome: React.FC<DesktopWindowChromeProps> = ({
  platform,
  setPlatform,
  profile,
  onOpenLogin,
  onOpenPortingGuide,
  onOpenApiGuide,
  onToggleExclusive,
  onRefreshData,
  isRefreshing,
}) => {
  return (
    <header className="h-10 border-b border-slate-800 bg-[#0c1017] flex items-center justify-between px-3 text-xs select-none z-40 shrink-0">
      {/* Zone 1: Window Controls / Brand */}
      <div className="flex items-center gap-3">
        {platform === 'macos' && (
          <div className="flex items-center gap-2 mr-2">
            <span 
              title="Close window"
              className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer hover:opacity-80 transition-opacity"
            />
            <span 
              title="Minimize"
              className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] cursor-pointer hover:opacity-80 transition-opacity"
            />
            <span 
              title="Zoom"
              className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-pointer hover:opacity-80 transition-opacity"
            />
          </div>
        )}

        <div className="flex items-center gap-2 font-medium tracking-tight text-slate-200">
          <div className="w-5 h-5 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-[10px]">
            LP
          </div>
          <span className="font-semibold text-slate-100">LensPulse</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            Getty Images Contributor Studio
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ESP Active</span>
          </div>
        </div>
      </div>

      {/* Zone 2: Contributor Status & Platform Switcher */}
      <div className="flex items-center gap-2">
        {/* Windows / macOS Platform Simulator Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded p-0.5 text-[11px]">
          <button
            onClick={() => setPlatform('windows')}
            className={`px-2 py-0.5 rounded transition-colors ${
              platform === 'windows' 
                ? 'bg-slate-800 text-cyan-400 font-medium shadow-xs' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Switch UI to Windows 11 Fluent frame & shortcuts"
          >
            Windows
          </button>
          <button
            onClick={() => setPlatform('macos')}
            className={`px-2 py-0.5 rounded transition-colors ${
              platform === 'macos' 
                ? 'bg-slate-800 text-cyan-400 font-medium shadow-xs' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Switch UI to Apple macOS Tahoe/Sonoma frame & shortcuts"
          >
            macOS
          </button>
        </div>

        {/* Porting Guide Button */}
        <button
          onClick={onOpenPortingGuide}
          className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors text-[11px]"
          title="See how to build Windows .exe & port to Mac .dmg via Tauri / Electron"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Cross-Platform Porting Guide</span>
        </button>

        {/* API Architecture Guide Button */}
        <button
          onClick={onOpenApiGuide}
          className="flex items-center gap-1 px-2 py-1 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-400 transition-colors text-[11px]"
          title="Information on Getty Images Contributor API & ESP endpoints"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Getty API Info</span>
        </button>

        {/* Refresh Sync */}
        <button
          onClick={onRefreshData}
          disabled={isRefreshing}
          className="p-1 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          title="Sync latest sales data from ESP"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>

      {/* Zone 3: Account Profile & Windows Controls */}
      <div className="flex items-center gap-3">
        {/* Contributor Profile Capsule */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-2 hover:bg-slate-800/60 p-1 rounded transition-colors text-left"
            title="Switch Contributor Account or configure API credentials"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-800 border border-slate-700">
              <img 
                src={profile.avatarUrl} 
                alt={profile.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="hidden xl:block leading-tight">
              <div className="font-medium text-slate-200 text-[11px] truncate max-w-[120px]">
                {profile.name}
              </div>
              <div className="text-[10px] text-amber-400/90 font-mono">
                {profile.id}
              </div>
            </div>
          </button>

          {/* Quick Exclusive vs Non-Exclusive Royalty Rate Switcher */}
          <button
            onClick={onToggleExclusive}
            className={`hidden 2xl:flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
              profile.tier === 'Exclusive'
                ? 'bg-amber-950/40 border-amber-600/40 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
            title="Click to toggle Exclusive (40%) vs Non-Exclusive (20%) tier calculation"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>{profile.tier} ({(profile.royaltyRate).split(' ')[0]})</span>
          </button>
        </div>

        {/* Windows Standard Title Bar Window Controls */}
        {platform === 'windows' && (
          <div className="flex items-center ml-1 border-l border-slate-800 pl-2">
            <button 
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
              title="Minimize"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button 
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
              title="Maximize"
            >
              <Square className="w-3 h-3" />
            </button>
            <button 
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-600 transition-colors"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
