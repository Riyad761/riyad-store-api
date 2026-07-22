import React, { useState } from 'react';
import { Play, Send, Copy, Check, Clock, ShieldCheck, Terminal, ArrowRight } from 'lucide-react';

interface ApiEndpointOption {
  id: string;
  label: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  defaultBody?: string;
  description: string;
}

const ENDPOINTS: ApiEndpointOption[] = [
  {
    id: 'list',
    label: 'List Commands',
    method: 'GET',
    path: '/api/store/list?sort=newest&limit=10',
    description: 'Retrieve paginated list of commands with category & sort filters',
  },
  {
    id: 'search',
    label: 'Search Commands',
    method: 'GET',
    path: '/api/store/search?q=ai',
    description: 'Search store commands by query keyword',
  },
  {
    id: 'info',
    label: 'Command Details',
    method: 'GET',
    path: '/api/store/info/1',
    description: 'Get command metadata JSON by ID',
  },
  {
    id: 'raw',
    label: 'Get Raw Code Script',
    method: 'GET',
    path: '/api/store/raw/1',
    description: 'Direct raw JavaScript string output for bot execution',
  },
  {
    id: 'upload',
    label: 'Upload Command',
    method: 'POST',
    path: '/api/store/upload',
    description: 'Upload a new command plugin to store',
    defaultBody: JSON.stringify({
      name: "sticker-maker-v2",
      version: "2.0.0",
      author: "Riyad Dev",
      category: "Tools",
      description: "Convert images to WhatsApp stickers",
      rawCode: "module.exports = { name: 'sticker', execute: () => {} };"
    }, null, 2),
  },
  {
    id: 'update',
    label: 'Update Command',
    method: 'PUT',
    path: '/api/store/update/1',
    description: 'Update existing command plugin',
    defaultBody: JSON.stringify({
      version: "1.2.1",
      description: "Updated version with performance improvements"
    }, null, 2),
  },
  {
    id: 'like',
    label: 'Like Command',
    method: 'POST',
    path: '/api/store/like/1',
    description: 'Increment command like counter',
  },
  {
    id: 'download',
    label: 'Increment Download',
    method: 'POST',
    path: '/api/store/download/1',
    description: 'Increment download counter',
  },
  {
    id: 'delete',
    label: 'Delete Command',
    method: 'DELETE',
    path: '/api/store/delete/1',
    description: 'Remove command plugin from store',
  },
  {
    id: 'health',
    label: 'API Health Status',
    method: 'GET',
    path: '/api/health',
    description: 'Check API and Database connection health',
  }
];

export const ApiTester: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpointOption>(ENDPOINTS[0]);
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [path, setPath] = useState(ENDPOINTS[0].path);
  const [requestBody, setRequestBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<string | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [copiedResponse, setCopiedResponse] = useState(false);

  const selectEndpoint = (ep: ApiEndpointOption) => {
    setSelectedEndpoint(ep);
    setMethod(ep.method);
    setPath(ep.path);
    setRequestBody(ep.defaultBody || '');
    setResponseStatus(null);
    setResponseData(null);
  };

  const handleSendRequest = async () => {
    setLoading(true);
    setResponseStatus(null);
    setResponseData(null);
    const startTime = performance.now();

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
        },
      };

      if ((method === 'POST' || method === 'PUT') && requestBody.trim()) {
        options.body = requestBody;
      }

      const res = await fetch(path, options);
      const endTime = performance.now();
      setExecutionTime(Math.round(endTime - startTime));
      setResponseStatus(res.status);

      // Collect headers
      const resHeaders: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        resHeaders[key] = val;
      });
      setResponseHeaders(resHeaders);

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        setResponseData(JSON.stringify(json, null, 2));
      } else {
        const text = await res.text();
        setResponseData(text);
      }
    } catch (err: any) {
      const endTime = performance.now();
      setExecutionTime(Math.round(endTime - startTime));
      setResponseStatus(500);
      setResponseData(JSON.stringify({ error: err.message || 'Network error executing API call' }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const getMethodBadge = (m: string) => {
    switch (m) {
      case 'GET':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'POST':
        return 'bg-cyan-950 text-cyan-400 border-cyan-800';
      case 'PUT':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'DELETE':
        return 'bg-rose-950 text-rose-400 border-rose-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const copyResponse = () => {
    if (!responseData) return;
    navigator.clipboard.writeText(responseData);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Playground Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-slate-100">Interactive API Playground</h2>
            </div>
            <p className="text-xs text-slate-400">
              Test all 9+ REST endpoints of Riyad Store API directly in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Helmet Security & Rate Limiter Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoint Selector Panel */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2 font-mono">
            Available Endpoints
          </h3>
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {ENDPOINTS.map(ep => (
              <button
                key={ep.id}
                onClick={() => selectEndpoint(ep)}
                className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-center justify-between gap-2 ${
                  selectedEndpoint.id === ep.id
                    ? 'bg-slate-800 border-cyan-500/80 shadow-md text-slate-100'
                    : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800/80 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold border rounded ${getMethodBadge(ep.method)}`}>
                      {ep.method}
                    </span>
                    <span className="font-semibold">{ep.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{ep.path}</p>
                </div>
                <ArrowRight className={`w-3.5 h-3.5 transition-transform ${selectedEndpoint.id === ep.id ? 'text-cyan-400 translate-x-1' : 'text-slate-600'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Request Execution Console */}
        <div className="lg:col-span-8 space-y-6">
          {/* Request Input Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <select
                value={method}
                onChange={e => setMethod(e.target.value as any)}
                className={`px-3 py-2 text-xs font-mono font-bold border rounded-xl focus:outline-none bg-slate-950 ${getMethodBadge(method)}`}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>

              <input
                type="text"
                value={path}
                onChange={e => setPath(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
              />

              <button
                onClick={handleSendRequest}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/20 transition-all disabled:opacity-50"
              >
                {loading ? <Clock className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Send</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
              💡 {selectedEndpoint.description}
            </p>

            {(method === 'POST' || method === 'PUT') && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                  JSON Request Body
                </label>
                <textarea
                  rows={6}
                  value={requestBody}
                  onChange={e => setRequestBody(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}
          </div>

          {/* Response Output Console */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300 font-mono">HTTP Response</span>
                {responseStatus !== null && (
                  <span
                    className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-md border ${
                      responseStatus >= 200 && responseStatus < 300
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border-rose-800'
                    }`}
                  >
                    {responseStatus} {responseStatus >= 200 && responseStatus < 300 ? 'OK' : 'Error'}
                  </span>
                )}
                {executionTime !== null && (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {executionTime} ms
                  </span>
                )}
              </div>

              {responseData && (
                <button
                  onClick={copyResponse}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                >
                  {copiedResponse ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Payload</span>
                </button>
              )}
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 min-h-[220px] max-h-[450px] overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center h-40 text-slate-500 gap-2 text-xs">
                  <Clock className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Executing API request...</span>
                </div>
              ) : responseData ? (
                <pre className="text-xs font-mono text-emerald-400 leading-relaxed whitespace-pre-wrap">
                  <code>{responseData}</code>
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-slate-600 text-xs font-mono">
                  <Play className="w-6 h-6 mb-2 opacity-40 text-cyan-400" />
                  <span>Click "Send" above to execute API call and inspect response JSON</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
