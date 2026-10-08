import React from 'react';
import { X, Globe, Server, Key, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

interface GettyApiGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GettyApiGuideModal: React.FC<GettyApiGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#101726] border border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Getty Images Contributor API & ESP Architecture</h2>
              <p className="text-[11px] text-slate-400">Technical audit of Getty / iStock Contributor integrations</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-lg">
            <h3 className="font-semibold text-slate-100 flex items-center gap-2 mb-1.5">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>1. How Getty Images Contributor System Works (ESP)</span>
            </h3>
            <p className="text-slate-400">
              Getty Images and iStock contributors operate on the <strong>ESP (Enterprise Submissions Platform)</strong> at <code className="text-cyan-300 font-mono">esp.gettyimages.com</code>. 
              Submissions, batch curation, model releases, and monthly royalty statements are routed through the ESP engine.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>2. Contributor API Availability</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg">
                <div className="font-medium text-slate-200 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Getty Connect REST API v3</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Getty maintains an official REST API for enterprise customers and developers. Access requires an API Key & Secret obtained through an active partner contract.
                </p>
              </div>

              <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg">
                <div className="font-medium text-slate-200 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ESP Contributor Ingestion (sFTP / REST)</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  For high-volume stock contributors, Getty provides automated sFTP ingestion and ESP batch APIs with JSON/CSV sidecar metadata.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-lg space-y-2">
            <h4 className="font-semibold text-slate-200 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>3. How This Desktop App Handles Authentication</span>
            </h4>
            <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
              <li><strong>Direct ESP Login:</strong> Authenticates via Contributor Portal credentials with 2FA TOTP support.</li>
              <li><strong>Connect API Key:</strong> Supports direct enterprise v3 REST tokens for agencies.</li>
              <li><strong>Offline Fallback & Local Encryption:</strong> Sensitive keys and tokens are securely isolated in the app runtime without 3rd party telemetry.</li>
            </ul>
          </div>

          <div className="p-3 bg-amber-950/20 border border-amber-600/30 rounded-lg flex items-start gap-2.5 text-[11px] text-amber-200/90">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Note on Generative AI:</strong> Getty Images and iStock strictly prohibit submitting synthetic images created via generative AI tools (Midjourney, DALL-E, Firefly). LensPulse enforces human photographic EXIF integrity validation before submission.
            </span>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
