import { useState, useEffect } from 'react';


export default function App() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '650px',
        width: '100%',
        backgroundColor: '#131b2e',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        padding: '2.5rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          display: 'inline-block',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          backgroundColor: '#3b82f61a',
          color: '#60a5fa',
          fontSize: '0.875rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>
          DUONEXX FULLSTACK
        </div>

        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: '800',
          letterSpacing: '-0.025em',
          marginBottom: '0.75rem',
          background: 'linear-gradient(to right, #60a5fa, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {{PROJECT_NAME}}
        </h1>

        <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '2rem', lineHeight: '1.5' }}>
          Dual-mode architecture: Frontend dev server proxies <code>/api</code> in dev, while the backend serves the compiled client bundle in production.
        </p>

        <div style={{
          backgroundColor: '#0a0f1d',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '1.25rem',
          textAlign: 'left',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>
              API Status (/api/health)
            </span>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: loading ? '#f59e0b' : (error ? '#ef4444' : '#10b981')
            }}></span>
          </div>

          {loading && <p style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Checking backend connection...</p>}
          {error && <p style={{ color: '#f87171', fontSize: '0.9rem' }}>Error: {error} (Ensure backend is running)</p>}
          {health && (
            <pre style={{
              color: '#38bdf8',
              fontSize: '0.85rem',
              overflowX: 'auto',
              fontFamily: 'monospace'
            }}>
              {JSON.stringify(health, null, 2)}
            </pre>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '1rem',
          textAlign: 'left'
        }}>
          <div style={{
            padding: '1rem',
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '8px'
          }}>
            <h3 style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: '600', marginBottom: '0.25rem' }}>
              🛠️ Dev Mode
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Vite (5173) ⇄ Backend (3000)
            </p>
          </div>
          <div style={{
            padding: '1rem',
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '8px'
          }}>
            <h3 style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: '600', marginBottom: '0.25rem' }}>
              🚀 Prod Mode
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Backend serves static & /api
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
