import React, { useState } from 'react';
import { X, Upload, FileCode, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUploadSuccess }) => {
  const [name, setName] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [author, setAuthor] = useState('Riyad Dev');
  const [category, setCategory] = useState('Tools');
  const [description, setDescription] = useState('');
  const [rawCode, setRawCode] = useState(`// Riyad Bot Framework Plugin
module.exports = {
  name: "custom_command",
  description: "Plugin description",
  category: "Tools",
  execute: async (bot, message, args) => {
    await message.reply("Hello from Riyad Bot plugin!");
  }
};`);
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/store/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim().toLowerCase(),
          version,
          author,
          category,
          description,
          rawCode,
          isFeatured,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to upload command plugin');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onUploadSuccess();
        onClose();
        // Reset form
        setName('');
        setDescription('');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Error connecting to API server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100">Upload Plugin to Riyad Store</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-950/60 border border-rose-800/80 text-rose-300 text-sm rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-sm rounded-xl">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Plugin uploaded successfully! Refreshing store...</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Command Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ai-chat, downloader"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Version</label>
              <input
                type="text"
                placeholder="1.0.0"
                value={version}
                onChange={e => setVersion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Author Name</label>
              <input
                type="text"
                placeholder="Your username or team"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="AI">AI</option>
                <option value="Tools">Tools</option>
                <option value="Media">Media</option>
                <option value="Moderation">Moderation</option>
                <option value="Games">Games</option>
                <option value="Utility">Utility</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Plugin Description</label>
            <textarea
              rows={2}
              placeholder="Explain what this command does for Riyad Bot framework..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">
                Raw JavaScript Source Code <span className="text-rose-400">*</span>
              </label>
              <span className="text-[10px] text-slate-500">Node.js CommonJS plugin format</span>
            </div>
            <textarea
              rows={7}
              required
              value={rawCode}
              onChange={e => setRawCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={e => setIsFeatured(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-cyan-600 focus:ring-cyan-500"
            />
            <label htmlFor="isFeatured" className="text-xs text-slate-300 cursor-pointer">
              Mark as Featured Command
            </label>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Publish to Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
