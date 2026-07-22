import React, { useState } from 'react';
import { Terminal, Copy, Check, FileCode, Server, Shield, Sparkles, Cpu } from 'lucide-react';

export const IntegrationGuide: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copySnippet = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const clientSnippet = `const axios = require('axios');
const fs = require('fs');

async function installBotCommand(commandId) {
  const STORE_API = 'http://localhost:3000'; // or https://riyad-store-api.onrender.com
  
  try {
    // 1. Fetch Command Info
    const infoRes = await axios.get(\`\${STORE_API}/api/store/info/\${commandId}\`);
    const cmdInfo = infoRes.data.data;
    
    // 2. Fetch Raw JS Source Code directly
    const rawRes = await axios.get(\`\${STORE_API}/api/store/raw/\${commandId}\`);
    
    // 3. Save as plugin inside bot commands folder
    const targetFile = \`./commands/\${cmdInfo.name}.js\`;
    fs.writeFileSync(targetFile, rawRes.data);
    
    // 4. Increment download counter
    await axios.post(\`\${STORE_API}/api/store/download/\${commandId}\`);
    
    console.log(\`✅ Plugin "\${cmdInfo.name}" v\${cmdInfo.version} installed!\`);
  } catch (err) {
    console.error('❌ Plugin installation failed:', err.message);
  }
}

// Example: Install plugin ID 1
installBotCommand(1);`;

  const curlListSnippet = `curl http://localhost:3000/api/store/list?sort=trending`;
  const curlRawSnippet = `curl http://localhost:3000/api/store/raw/1`;
  const curlUploadSnippet = `curl -X POST http://localhost:3000/api/store/upload \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "welcome-card",
    "version": "1.0.0",
    "author": "Riyad Dev",
    "category": "Tools",
    "description": "Welcome message generator plugin",
    "rawCode": "module.exports = { name: \\"welcome\\", execute: (bot, msg) => msg.reply(\\"Welcome!\\") };"
  }'`;

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-xl text-white">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Riyad Bot Integration Guide</h2>
            <p className="text-xs text-slate-400">
              Connect your custom WhatsApp/Telegram/Discord bot framework directly to Riyad Store API.
            </p>
          </div>
        </div>
      </div>

      {/* Render Deployment Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm font-mono">
          <Server className="w-4 h-4" />
          <span>Deploying to Render (1-Click Blueprint Ready)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          This project includes a pre-configured <code className="text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">render.yaml</code> file. Simply connect your GitHub repository to Render.com and choose "Blueprint Service".
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="font-bold text-slate-200 block mb-1">Build Command</span>
            <code className="text-emerald-400 font-mono">npm install</code>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="font-bold text-slate-200 block mb-1">Start Command</span>
            <code className="text-emerald-400 font-mono">npm start</code>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="font-bold text-slate-200 block mb-1">Environment</span>
            <code className="text-amber-400 font-mono">MONGODB_URI, PORT=3000</code>
          </div>
        </div>
      </div>

      {/* Bot Client Integration Code */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">Node.js Bot Client Plugin Installer</h3>
          </div>
          <button
            onClick={() => copySnippet(clientSnippet, 'client')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
          >
            {copiedCode === 'client' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Code</span>
          </button>
        </div>

        <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
          <code>{clientSnippet}</code>
        </pre>
      </div>

      {/* cURL Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 font-mono">Fetch Raw Plugin (cURL)</span>
            <button
              onClick={() => copySnippet(curlRawSnippet, 'curlRaw')}
              className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
            >
              {copiedCode === 'curlRaw' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
            <code>{curlRawSnippet}</code>
          </pre>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 font-mono">Upload Command (cURL)</span>
            <button
              onClick={() => copySnippet(curlUploadSnippet, 'curlUpload')}
              className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
            >
              {copiedCode === 'curlUpload' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-amber-300 overflow-x-auto">
            <code>{curlUploadSnippet}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
