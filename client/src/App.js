import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #13131a;
    --border: #1e1e2e;
    --accent: #7c6aff;
    --accent-glow: rgba(124, 106, 255, 0.25);
    --text: #e8e8f0;
    --muted: #6b6b80;
    --error: #ff6b6b;
    --success: #6bffb8;
    --font-head: 'Syne', sans-serif;
    --font-mono: 'DM Mono', monospace;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-head);
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }

  .app::before, .app::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    filter: blur(100px);
    pointer-events: none;
    z-index: 0;
  }
  .app::before {
    width: 500px; height: 500px;
    background: rgba(124, 106, 255, 0.08);
    top: -150px; left: -150px;
  }
  .app::after {
    width: 400px; height: 400px;
    background: rgba(107, 255, 184, 0.05);
    bottom: -100px; right: -100px;
  }

  .card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 520px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 3rem 2.5rem;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.03), 0 32px 64px rgba(0,0,0,0.5);
    animation: fadeUp 0.5s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .badge {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent);
    background: var(--accent-glow);
    border: 1px solid rgba(124,106,255,0.3);
    padding: 4px 12px;
    border-radius: 100px;
    margin-bottom: 1.25rem;
  }

  h1 {
    font-size: 2.4rem;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin-bottom: 0.5rem;
  }

  h1 span { color: var(--accent); }

  .subtitle {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--muted);
    margin-bottom: 2.5rem;
  }

  .input-group { position: relative; margin-bottom: 1rem; }

  .input-group input {
    width: 100%;
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 14px 16px;
    font-size: 0.9rem;
    font-family: var(--font-mono);
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .input-group input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }

  .input-group input::placeholder { color: var(--muted); }
  .input-group input:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-primary {
    width: 100%;
    padding: 14px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 12px;
    font-family: var(--font-head);
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    position: relative;
    overflow: hidden;
  }

  .btn-primary::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    pointer-events: none;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px var(--accent-glow);
  }

  .btn-primary:active:not(:disabled) { transform: translateY(0); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

  .error-msg {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--error);
    background: rgba(255,107,107,0.08);
    border: 1px solid rgba(255,107,107,0.2);
    border-radius: 8px;
    padding: 10px 14px;
    margin-top: 1rem;
    animation: fadeUp 0.2s ease both;
  }

  .result-box {
    margin-top: 1.5rem;
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 1rem 1.25rem;
    animation: fadeUp 0.3s ease both;
  }

  .result-label {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .result-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .result-link {
    flex: 1;
    font-family: var(--font-mono);
    font-size: 0.88rem;
    color: var(--accent);
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .result-link:hover { text-decoration: underline; }

  .btn-copy {
    flex-shrink: 0;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 6px 14px;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text);
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }

  .btn-copy:hover { border-color: var(--accent); color: var(--accent); }

  .btn-copy.copied {
    border-color: var(--success);
    color: var(--success);
    background: rgba(107,255,184,0.08);
  }

  .divider { border: none; border-top: 1px solid var(--border); margin: 2rem 0 1.25rem; }

  .footer {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--muted);
    text-align: center;
    letter-spacing: 0.05em;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    display: inline-block;
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
  }
`;

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setShortUrl("");
    setCopied(false);

    if (!url.trim()) { setError("Please enter a URL."); return; }
    if (!isValidUrl(url)) { setError("Invalid URL — must start with http:// or https://"); return; }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: url }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Server error");
      }

      const data = await res.json();
      setShortUrl(data.shortUrl);
    } catch (err) {
      setError(err.name === "TypeError" ? "Could not reach the server. Is it running?" : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy to clipboard.");
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="card">
          <div className="badge">URL Shortener</div>
          <h1>Make links <span>tiny.</span></h1>
          <p className="subtitle">paste a long url. get a short one. done.</p>

          <div className="input-group">
            <input
              type="text"
              placeholder="https://your-very-long-url.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              disabled={loading}
            />
          </div>

          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <><span className="spinner" />Shortening…</> : "Shorten URL →"}
          </button>

          {error && <div className="error-msg">⚠ {error}</div>}

          {shortUrl && (
            <div className="result-box">
              <div className="result-label">Your short link</div>
              <div className="result-row">
                <a className="result-link" href={shortUrl} target="_blank" rel="noreferrer">
                  {shortUrl}
                </a>
                <button className={`btn-copy${copied ? " copied" : ""}`} onClick={handleCopy}>
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}

          <hr className="divider" />
          <p className="footer">links live in memory · restart resets all</p>
        </div>
      </div>
    </>
  );
}