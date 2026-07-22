import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { CommandCard } from './components/CommandCard';
import { UploadModal } from './components/UploadModal';
import { CodeViewerModal } from './components/CodeViewerModal';
import { ApiTester } from './components/ApiTester';
import { IntegrationGuide } from './components/IntegrationGuide';
import { StoreCommand, HealthCheck } from './types';
import { Search, Filter, Sparkles, RefreshCw, Layers, TrendingUp, Download, Heart, Command } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'store' | 'api-tester' | 'guide'>('store');
  const [commands, setCommands] = useState<StoreCommand[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [health, setHealth] = useState<HealthCheck | null>(null);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedCommandForCode, setSelectedCommandForCode] = useState<StoreCommand | null>(null);

  // Fetch health check status
  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      }
    } catch (err) {
      console.warn('Health check warning:', err);
    }
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/store/categories');
      if (res.ok) {
        const json = await res.json();
        if (json.data) setCategories(json.data);
      }
    } catch (err) {
      console.warn('Categories error:', err);
    }
  }, []);

  // Fetch Commands with search and filters
  const fetchCommands = useCallback(async () => {
    setLoading(true);
    try {
      let url = '';
      if (searchQuery.trim()) {
        url = `/api/store/search?q=${encodeURIComponent(searchQuery.trim())}&category=${encodeURIComponent(selectedCategory)}&sort=${selectedSort}`;
      } else {
        url = `/api/store/list?category=${encodeURIComponent(selectedCategory)}&sort=${selectedSort}&limit=50`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setCommands(json.data || []);
      }
    } catch (err) {
      console.error('Error fetching commands:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedSort]);

  useEffect(() => {
    checkHealth();
    fetchCategories();
  }, [checkHealth, fetchCategories]);

  useEffect(() => {
    fetchCommands();
  }, [fetchCommands]);

  // Action handlers
  const handleLike = async (id: number) => {
    try {
      const res = await fetch(`/api/store/like/${id}`, { method: 'POST' });
      if (res.ok) {
        setCommands(prev =>
          prev.map(item => (item.id === id ? { ...item, likes: item.likes + 1 } : item))
        );
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleDownload = async (id: number) => {
    try {
      const res = await fetch(`/api/store/download/${id}`, { method: 'POST' });
      if (res.ok) {
        setCommands(prev =>
          prev.map(item => (item.id === id ? { ...item, downloads: item.downloads + 1 } : item))
        );
      }
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete command ID #${id}?`)) return;

    try {
      const res = await fetch(`/api/store/delete/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCommands(prev => prev.filter(item => item.id !== id));
        fetchCategories();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        isDbConnected={Boolean(health?.database?.isConnected)}
        totalCommands={commands.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Tab 1: Store Directory */}
        {activeTab === 'store' && (
          <div className="space-y-6">
            {/* Hero / Filter Section */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-cyan-300">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Riyad Bot Command & Plugin Repository</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Discover & Deploy Plugins for <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                    Riyad Bot Framework
                  </span>
                </h1>

                <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Search through community commands, raw script downloaders, AI chat handlers, and group moderation tools. Connect your bot instance directly via clean REST endpoints.
                </p>

                {/* Search & Filter Bar */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* Search Input */}
                  <div className="sm:col-span-6 relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search commands, authors, code keywords..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="sm:col-span-3">
                    <select
                      value={selectedCategory}
                      onChange={e => setSelectedCategory(e.target.value)}
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div className="sm:col-span-3">
                    <select
                      value={selectedSort}
                      onChange={e => setSelectedSort(e.target.value)}
                      className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                    >
                      <option value="newest">Newest First</option>
                      <option value="trending">Trending & Popular</option>
                      <option value="downloads">Most Downloaded</option>
                      <option value="likes">Most Liked</option>
                      <option value="featured">Featured First</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs scrollbar-none">
              <span className="text-slate-500 font-medium shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Quick Filter:
              </span>
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-3 py-1 rounded-lg border transition-all shrink-0 ${
                  selectedCategory === ''
                    ? 'bg-cyan-600 border-cyan-500 text-white font-semibold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({commands.length})
              </button>
              {['AI', 'Tools', 'Media', 'Moderation', 'Games', 'Utility'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg border transition-all shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-cyan-600 border-cyan-500 text-white font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Commands Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
                <p className="text-xs font-mono">Fetching Riyad Store commands...</p>
              </div>
            ) : commands.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                <Command className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-300">No Commands Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No plugins match your current query or category filter. Try clearing filters or publish a new command!
                </p>
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors shadow-md"
                >
                  Upload First Plugin
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {commands.map(cmd => (
                  <CommandCard
                    key={cmd.id || cmd._id}
                    command={cmd}
                    onViewCode={c => setSelectedCommandForCode(c)}
                    onLike={handleLike}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Interactive API Playground */}
        {activeTab === 'api-tester' && <ApiTester />}

        {/* Tab 3: Bot Setup & Integration */}
        {activeTab === 'guide' && <IntegrationGuide />}
      </main>

      {/* Upload Plugin Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={() => {
          fetchCommands();
          fetchCategories();
        }}
      />

      {/* Raw Code Viewer Modal */}
      <CodeViewerModal
        command={selectedCommandForCode}
        onClose={() => setSelectedCommandForCode(null)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Riyad Store API</span>
            <span>&copy; {new Date().getFullYear()} Hasan Riyad - Riyad Bot Framework</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-slate-400">Node.js + Express + Mongoose</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-mono">Render Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
