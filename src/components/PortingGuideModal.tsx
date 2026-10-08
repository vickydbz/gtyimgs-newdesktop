import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Monitor, Laptop, FileCode, CheckCircle2 } from 'lucide-react';

interface PortingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PortingGuideModal: React.FC<PortingGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyCode = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const tauriCommands = `# 1. Install Tauri CLI (Recommended for lightweight, fast desktop apps)
npm install -D @tauri-apps/cli

# 2. Build for Windows (.exe / .msi installer)
npm run tauri build -- --target x86_64-pc-windows-msvc

# 3. Port & Build for Apple Mac (.dmg / Universal Binary for M1/M2/M3/M4 & Intel)
npm run tauri build -- --target universal-apple-darwin`;

  const electronCommands = `# 1. Install Electron packager
npm install -D electron electron-builder

# 2. Package for Windows (NSIS Installer)
npx electron-builder --win

# 3. Port & Package for Apple Mac (.dmg)
npx electron-builder --mac`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#101726] border border-slate-800 rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Windows to Apple Mac Porting Roadmap</h2>
              <p className="text-[11px] text-slate-400">Packaging this React app for Windows & macOS desktop distributions</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto text-xs text-slate-300 leading-relaxed">
          {/* Architecture overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
              <div className="flex items-center gap-2 font-medium text-slate-100 mb-2">
                <Monitor className="w-4 h-4 text-cyan-400" />
                <span>Phase 1: Windows 11 Build</span>
              </div>
              <p className="text-slate-400 text-[11px] mb-2">
                Builds native Windows 64-bit installer with Mica/Acrylic window chrome, system tray integration, and native notification support.
              </p>
              <div className="text-[10px] text-cyan-400 font-mono">Output: LensPulse-Setup.exe / .msi</div>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
              <div className="flex items-center gap-2 font-medium text-slate-100 mb-2">
                <Laptop className="w-4 h-4 text-amber-400" />
                <span>Phase 2: macOS Porting & Notarization</span>
              </div>
              <p className="text-slate-400 text-[11px] mb-2">
                Re-compiles for macOS with traffic-light top bar, Apple Silicon native arm64 support, and codesign notarization for Gatekeeper.
              </p>
              <div className="text-[10px] text-amber-400 font-mono">Output: LensPulse-Universal.dmg / .app</div>
            </div>
          </div>

          {/* Option A: Tauri */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Approach A: Tauri 2.0 (Recommended: Lightweight &lt;15MB, Native WebView)</span>
              </span>
              <button
                onClick={() => copyCode('tauri', tauriCommands)}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
              >
                {copiedKey === 'tauri' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'tauri' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre">
              {tauriCommands}
            </pre>
          </div>

          {/* Option B: Electron */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>Approach B: Electron Builder (Classic Node.js desktop wrapper)</span>
              </span>
              <button
                onClick={() => copyCode('electron', electronCommands)}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
              >
                {copiedKey === 'electron' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'electron' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre">
              {electronCommands}
            </pre>
          </div>

          {/* Features verified for cross-platform portability */}
          <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-lg">
            <div className="font-semibold text-slate-200 mb-2">Cross-Platform Verification Checklist:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>No OS-specific file system paths (POSIX compatible)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Adaptive window chrome (Windows controls & Mac traffic lights)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Keyboard shortcut mapping (Ctrl on Win, Cmd ⌘ on Mac)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Native PDF & CSV file download streams</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
