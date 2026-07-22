import React, { useState } from 'react';
import { Download, Heart, Code, Trash2, Sparkles, User, Tag, Copy, Check } from 'lucide-react';
import { StoreCommand } from '../types';

interface CommandCardProps {
  command: StoreCommand;
  onViewCode: (command: StoreCommand) => void;
  onLike: (id: number) => void;
  onDownload: (id: number) => void;
  onDelete: (id: number) => void;
}

export const CommandCard: React.FC<CommandCardProps> = ({
  command,
  onViewCode,
  onLike,
  onDownload,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'ai':
        return 'bg-purple-950/80 text-purple-300 border-purple-800/60';
      case 'media':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60';
      case 'moderation':
        return 'bg-red-950/80 text-red-300 border-red-800/60';
      case 'games':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const copyRawUrl = () => {
    const rawUrl = `${window.location.origin}/api/store/raw/${command.id}`;
    navigator.clipboard.writeText(rawUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    setIsLiking(true);
    onLike(command.id);
    setTimeout(() => setIsLiking(false), 300);
  };

  return (
    <div className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition-all duration-200 flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors font-mono tracking-wide">
              !{command.name}
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-950 border border-slate-800 rounded-md">
              v{command.version}
            </span>
            {command.isFeatured && (
              <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-amber-950/80 text-amber-400 border border-amber-800/80 rounded-full">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Featured
              </span>
            )}
          </div>

          <span className={`px-2.5 py-0.5 text-xs font-medium border rounded-lg ${getCategoryColor(command.category)}`}>
            {command.category}
          </span>
        </div>

        {/* Author & Description */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
          <User className="w-3.5 h-3.5 text-slate-500" />
          <span>by <strong className="text-slate-300">{command.author}</strong></span>
        </div>

        <p className="text-sm text-slate-300 line-clamp-2 mb-4 leading-relaxed font-sans">
          {command.description || 'No detailed description provided for this plugin.'}
        </p>
      </div>

      {/* Code Snippet Preview Box */}
      <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80 font-mono text-xs text-slate-400 mb-4 relative group/code overflow-hidden">
        <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-800/60 pb-1 mb-2">
          <span>JavaScript Plugin</span>
          <span>ID: {command.id}</span>
        </div>
        <pre className="text-slate-300 text-[11px] overflow-hidden text-ellipsis whitespace-nowrap">
          <code>{command.rawCode.slice(0, 100)}...</code>
        </pre>
      </div>

      {/* Bottom Actions Bar */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
        {/* Counter Indicators */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition-colors ${
              isLiking ? 'scale-125 text-rose-500' : ''
            }`}
            title="Like command"
          >
            <Heart className={`w-4 h-4 ${command.likes > 0 ? 'fill-rose-500/20 text-rose-500' : ''}`} />
            <span className="font-mono font-medium">{command.likes}</span>
          </button>

          <button
            onClick={() => onDownload(command.id)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
            title="Record download"
          >
            <Download className="w-4 h-4" />
            <span className="font-mono font-medium">{command.downloads}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={copyRawUrl}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition-all"
            title="Copy Raw Code API URL"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => onViewCode(command)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/80 font-medium transition-all"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Raw Code</span>
          </button>

          <button
            onClick={() => onDelete(command.id)}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 border border-slate-700/60 hover:border-rose-800/80 transition-all"
            title="Delete plugin"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
