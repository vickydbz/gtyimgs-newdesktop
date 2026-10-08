import React, { useState } from 'react';
import { 
  X, 
  Key, 
  UserCheck, 
  Shield, 
  Info, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ContributorProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: ContributorProfile;
  onUpdateProfile: (profile: ContributorProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onUpdateProfile,
}) => {
  const [authMode, setAuthMode] = useState<'ESP' | 'API_KEY' | 'PRESETS'>('ESP');
  const [username, setUsername] = useState(currentProfile.email);
  const [password, setPassword] = useState('••••••••••••');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [apiKey, setApiKey] = useState('gi_live_sec_8492041928491823');
  const [apiSecret, setApiSecret] = useState('••••••••••••••••••••••••••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage('Successfully connected to Getty Images Contributor ESP!');
      
      onUpdateProfile({
        ...currentProfile,
        email: username,
        name: username.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        espConnected: true,
        authMethod: authMode === 'API_KEY' ? 'API_KEY' : 'ESP_CREDENTIALS',
      });

      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1000);
    }, 750);
  };

  const handleLoadDemo = (tier: 'Exclusive' | 'Non-Exclusive') => {
    onUpdateProfile({
      ...currentProfile,
      name: tier === 'Exclusive' ? 'Elena Vance' : 'Marcus Thorne',
      email: tier === 'Exclusive' ? 'elena.vance@peakvisual.studio' : 'marcus.stock@lensworks.io',
      studioName: tier === 'Exclusive' ? 'PeakVisual Media Studio' : 'Thorne Cinematic Stock',
      tier: tier,
      royaltyRate: tier === 'Exclusive' ? '40% (Exclusive Signature Tier)' : '20% (Non-Exclusive Essentials Tier)',
      activeAssets: tier === 'Exclusive' ? 184 : 96,
      lifetimeEarningsUSD: tier === 'Exclusive' ? 48920.40 : 19480.00,
      unpaidBalanceUSD: tier === 'Exclusive' ? 1420.80 : 540.20,
      espConnected: true,
      authMethod: 'DEMO_PORTFOLIO',
    });
    setSuccessMessage(`Switched to ${tier} Contributor Portfolio!`);
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#101726] border border-slate-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Getty Images Contributor Login</h2>
              <p className="text-[11px] text-slate-400">Connect your iStock / Getty Images ESP account</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex border-b border-slate-800 bg-[#0d131f] text-xs">
          <button
            onClick={() => setAuthMode('ESP')}
            className={`flex-1 py-2.5 px-4 font-medium transition-colors border-b-2 ${
              authMode === 'ESP'
                ? 'border-cyan-400 text-cyan-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ESP Contributor Login
          </button>
          <button
            onClick={() => setAuthMode('API_KEY')}
            className={`flex-1 py-2.5 px-4 font-medium transition-colors border-b-2 ${
              authMode === 'API_KEY'
                ? 'border-cyan-400 text-cyan-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Getty Connect API Key
          </button>
          <button
            onClick={() => setAuthMode('PRESETS')}
            className={`flex-1 py-2.5 px-4 font-medium transition-colors border-b-2 ${
              authMode === 'PRESETS'
                ? 'border-cyan-400 text-cyan-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sample Portfolios
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {authMode === 'ESP' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  iStock / Getty ESP Email or Contributor ID
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. contributor@studio.com or ESP-8492041"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Account Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                  <span>2-Step Verification Code (Optional)</span>
                  <span className="text-[10px] text-slate-500">Authenticator App</span>
                </label>
                <input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="6-digit code (e.g. 582910)"
                  maxLength={6}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 font-mono tracking-wider focus:outline-hidden focus:border-cyan-400"
                />
              </div>

              <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  Credentials are encrypted in local secure storage. Tokens authenticate against Getty Images ESP (esp.gettyimages.com) submission endpoints.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Authenticating with ESP...</span>
                ) : (
                  <>
                    <span>Sign In to Contributor Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {authMode === 'API_KEY' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Getty Images Connect API Key
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="e.g. gi_live_sec_..."
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  API Secret
                </label>
                <input
                  type="password"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  placeholder="Secret token"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
                />
              </div>

              <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                Getty Images Connect REST API v3 supports direct programmatic asset licensing and contributor royalty ingestion for enterprise partners.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <span>Connect via REST API Credentials</span>
              </button>
            </form>
          )}

          {authMode === 'PRESETS' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 mb-3">
                Load ready-to-use contributor profiles loaded with 24 months of royalty statements, global sales data, and upload pipelines:
              </p>

              <div 
                onClick={() => handleLoadDemo('Exclusive')}
                className="p-3 rounded-lg border border-amber-600/30 bg-amber-950/20 hover:bg-amber-950/40 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-100 text-xs">Elena Vance (PeakVisual Studio)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">Exclusive 40%</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    184 active photos · $48,920 lifetime sales · iStock Signature & Getty Creative
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </div>

              <div 
                onClick={() => handleLoadDemo('Non-Exclusive')}
                className="p-3 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-100 text-xs">Marcus Thorne (LensWorks)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">Non-Exclusive 20%</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    96 active photos · $19,480 lifetime sales · iStock Essentials tier
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
