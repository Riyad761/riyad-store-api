import React from 'react';
import { Bot, Terminal, Plus, ShieldCheck, Database, FileCode, Search, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'store' | 'api-tester' | 'guide';
  setActiveTab: (tab: 'store' | 'api-tester' | 'guide') => void;
  onOpenUpload: () => void;
  isDbConnected: boolean;
  totalCommands: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
  isDbConnected,
  totalCommands,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-100 via-cyan-200 to-emerald-400 bg-clip-text text-transparent">
                  Riyad Store API
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-full">
                  v1.0.0
                </span>
              </div>
              <p className="text-xs text-slate-400">Custom Riyad Bot Framework Plugin Hub</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('store')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'store'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Store Directory
              <span className="px-1.5 py-0.2 text-[10px] bg-slate-900 text-slate-300 rounded-md font-mono">
                {totalCommands}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('api-tester')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'api-tester'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              API Playground
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'guide'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              Bot Integration
            </button>
          </nav>

          {/* Action & Status */}
          <div className="flex items-center gap-3">
            {/* DB Status Badge */}
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${
              isDbConnected 
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60' 
                : 'bg-amber-950/40 text-amber-300 border-amber-800/60'
            }`}>
              <Database className="w-3.5 h-3.5" />
              <span>{isDbConnected ? 'MongoDB Connected' : 'Local Memory Sync'}</span>
            </div>

            {/* Upload Button */}
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-900/30 transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Plugin</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/80 text-xs">
          <button
            onClick={() => setActiveTab('store')}
            className={`px-3 py-1 rounded-md ${activeTab === 'store' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
          >
            Store
          </button>
          <button
            onClick={() => setActiveTab('api-tester')}
            className={`px-3 py-1 rounded-md ${activeTab === 'api-tester' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
          >
            API Tester
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1 rounded-md ${activeTab === 'guide' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
          >
            Bot Setup
          </button>
        </div>
      </div>
    </header>
  );
};
