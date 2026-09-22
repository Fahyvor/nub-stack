import { useState, useEffect } from 'react';

interface ApiHealth {
  status: string;
  message: string;
  server: string;
  timestamp: string;
}

export default function App() {
  const [health, setHealth] = useState<ApiHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then(data => {
        setHealth(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-[640px] w-full bg-[#131b2e] border border-slate-800 rounded-2xl p-8 sm:p-10 shadow-2xl">
        <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
          nub-stack fullstack
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-500 bg-clip-text text-transparent">
          {{PROJECT_NAME}}
        </h1>

        <p className="text-slate-400 text-sm sm:text-base mb-8 leading-relaxed">
          Dual-mode architecture: Frontend dev server proxies <code className="text-blue-300 font-mono">/api</code> in dev, while the backend serves the compiled client bundle in production. Styled with Tailwind CSS v4.
        </p>

        <div className="bg-[#0a0f1d] border border-slate-800 rounded-xl p-5 text-left mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
              API Status (/api/health)
            </span>
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full ${
                loading ? 'bg-amber-500 animate-pulse' : error ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
            />
          </div>

          {loading && <p className="text-slate-300 text-sm">Checking backend connection...</p>}
          {error && <p className="text-rose-400 text-sm">Error: {error} (Ensure backend is running)</p>}
          {health && (
            <pre className="text-sky-400 text-xs sm:text-sm overflow-x-auto font-mono bg-black/30 p-3 rounded-lg border border-slate-800/60">
              {JSON.stringify(health, null, 2)}
            </pre>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
            <h3 className="text-sm font-semibold text-slate-200 mb-1">
              Dev Mode
            </h3>
            <p className="text-xs text-slate-400">
              Vite (5173) ⇄ Backend (3000)
            </p>
          </div>
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
            <h3 className="text-sm font-semibold text-slate-200 mb-1">
              Prod Mode
            </h3>
            <p className="text-xs text-slate-400">
              Backend serves static & /api
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
