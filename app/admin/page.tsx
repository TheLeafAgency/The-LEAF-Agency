"use client";

import { useEffect, useMemo, useState } from "react";

const statuses = [
  "New",
  "Reviewing",
  "Contacted",
  "Discussing",
  "Proposal Sent",
  "Approved",
  "In Production",
  "Editing",
  "Publishing",
  "Completed",
  "Declined",
];

type LeafRequest = {
  id: string;
  business: string;
  contact: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  zipCode: string;
  budget: string;
  deadline: string;
  description: string;
  files: { name: string; url?: string }[];
  internalNotes: string;
  status: string;
  createdAt: string;
  howHeard?: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [requests, setRequests] = useState<LeafRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("New");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [expandedStat, setExpandedStat] = useState<string | null>(null);

  async function loadRequests() {
    const response = await fetch("/api/requests", { cache: "no-store" });
    if (!response.ok) {
      setAuthenticated(false);
      return;
    }
    const data = await response.json();
    setRequests(data.requests || []);
    setAuthenticated(true);
  }

  useEffect(() => {
    loadRequests().catch(() => setAuthenticated(false));
  }, []);

  const selected = requests.find((item) => item.id === selectedId) || null;

  useEffect(() => {
    if (selected) {
      setNotes(selected.internalNotes || "");
      setStatus(selected.status || "New");
      setMessage("");
    }
  }, [selectedId, selected]);

  const counts = useMemo(() => ({
    newRequests: requests.filter((item) => item.status === "New").length,
    active: requests.filter((item) => !["Completed", "Declined"].includes(item.status)).length,
    preProduction: requests.filter((item) => ["Reviewing", "Contacted", "Discussing", "Proposal Sent", "Approved"].includes(item.status)).length,
    awaiting: requests.filter((item) => ["Contacted", "Discussing", "Proposal Sent"].includes(item.status)).length,
  }), [requests]);

  const expandedRequests = useMemo(() => {
    if (!expandedStat) return [];
    if (expandedStat === "new") return requests.filter((item) => item.status === "New");
    if (expandedStat === "active") return requests.filter((item) => !["Completed", "Declined"].includes(item.status));
    if (expandedStat === "pre-production") return requests.filter((item) => ["Reviewing", "Contacted", "Discussing", "Proposal Sent", "Approved"].includes(item.status));
    if (expandedStat === "awaiting") return requests.filter((item) => ["Contacted", "Discussing", "Proposal Sent"].includes(item.status));
    return [];
  }, [expandedStat, requests]);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setLoginError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);

    if (!response.ok) {
      setLoginError("Incorrect password.");
      return;
    }

    setPassword("");
    await loadRequests();
  }

  async function saveRequest() {
    if (!selected) return;
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selected.id, status, internalNotes: notes }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.message || "Could not save changes.");
      return;
    }

    setRequests((current) => current.map((item) => item.id === data.request.id ? data.request : item));
    setMessage("Saved.");
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthenticated(false);
    setSelectedId(null);
    window.location.replace("/");
  }

  if (!authenticated) {
    return (
      <main className="admin-shell">
        <div className="login-card">
          <div className="leaf-mark">LEAF</div>
          <p className="admin-eyebrow">LEAF Agency</p>
          <h1>Dashboard Access</h1>
          <p>Enter the administrator password to continue.</p>
          <form onSubmit={login}>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" autoFocus />
            {loginError && <div className="error-message">{loginError}</div>}
            <button type="submit" disabled={!password || loading}>{loading ? "Checking..." : "Enter Dashboard"}</button>
          </form>
        </div>
        <style jsx>{adminStyles}</style>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <div className="dashboard">
        <header className="dashboard-header">
          <div>
            <p className="admin-eyebrow">LEAF Agency</p>
            <h1>LEAF Dashboard</h1>
            <p>Customer requests for advertising, organized in one place.</p>
          </div>
          <button className="logout" onClick={logout}>Log out</button>
        </header>

        <section className="stats-grid">
          <Stat index={0} label="NEW REQUESTS" value={counts.newRequests} selected={expandedStat === "new"} onClick={() => setExpandedStat(expandedStat === "new" ? null : "new")} />
          <Stat index={1} label="ACTIVE PROJECTS" value={counts.active} selected={expandedStat === "active"} onClick={() => setExpandedStat(expandedStat === "active" ? null : "active")} />
          <Stat index={2} label="PRE-PRODUCTION" value={counts.preProduction} selected={expandedStat === "pre-production"} onClick={() => setExpandedStat(expandedStat === "pre-production" ? null : "pre-production")} />
          <Stat index={3} label="AWAITING CLIENT" value={counts.awaiting} selected={expandedStat === "awaiting"} onClick={() => setExpandedStat(expandedStat === "awaiting" ? null : "awaiting")} />
        </section>

        {expandedStat && (
          <section className="stat-details-panel">
            <div className="expanded-stat-header">
              <div>
                <p className="admin-eyebrow">{expandedStat === "new" ? "NEW REQUESTS" : expandedStat === "active" ? "ACTIVE PROJECTS" : expandedStat === "pre-production" ? "PRE-PRODUCTION" : "AWAITING CLIENT"}</p>
                <h2>{expandedStat === "new" ? "New Requests" : expandedStat === "active" ? "Active Projects" : expandedStat === "pre-production" ? "Pre-Production" : "Awaiting Client"}</h2>
              </div>
              <button className="close-stat" onClick={() => setExpandedStat(null)}>Close ↑</button>
            </div>
            {expandedRequests.length === 0 ? <div className="stat-empty">Nothing here yet.</div> : (
              <div className="request-list">
                {expandedRequests.map((item) => (
                  <button key={item.id} className={`request-row ${selectedId === item.id ? "selected" : ""}`} onClick={() => setSelectedId(item.id)}>
                    <span className="request-id">{item.id}</span>
                    <span><strong>{item.business}</strong><small>{item.service || "Advertising request"}</small></span>
                    <span>{new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    <span className={`status-pill status-${item.status.toLowerCase().replace(/[^a-z]+/g, "-")}`}>{item.status}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}
        <section className="request-section">
          <div className="section-heading">
            <div>
              <p className="admin-eyebrow">Requests</p>
              <h2>New Requests</h2>
            </div>
            <button className="refresh" onClick={() => loadRequests()}>Refresh</button>
          </div>

          {requests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🌱</div>
              <h3>No requests yet.</h3>
              <p>When a customer completes the Get Started process, their request will appear here.</p>
            </div>
          ) : (
            <div className="request-list">
              {requests.map((item) => (
                <button key={item.id} className={`request-row ${selectedId === item.id ? "selected" : ""}`} onClick={() => setSelectedId(item.id)}>
                  <span className="request-id">{item.id}</span>
                  <span><strong>{item.business}</strong><small>{item.service || "Advertising request"}</small></span>
                  <span>{new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  <span className={`status-pill status-${item.status.toLowerCase().replace(/[^a-z]+/g, "-")}`}>{item.status}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        {selected && (
          <section className="detail-section">
            <div className="detail-header">
              <div>
                <p className="admin-eyebrow">Request details</p>
                <h2>{selected.id}</h2>
              </div>
              <button className="close-detail" onClick={() => setSelectedId(null)}>Close</button>
            </div>

            <div className="detail-grid">
              <Info label="Business" value={selected.business} />
              <Info label="Contact" value={selected.contact || "Not provided"} />
              <Info label="Email" value={selected.email} />
              <Info label="Phone" value={selected.phone} />
              <Info label="Service" value={selected.service || "Not provided"} />
              <Info label="Location" value={selected.location || selected.zipCode || "Not provided"} />
              <Info label="Budget" value={selected.budget || "Not provided"} />
              <Info label="Deadline" value={selected.deadline || "Not provided"} />
            </div>

            <div className="detail-block">
              <h3>Description</h3>
              <p className="description">{selected.description || "No description provided."}</p>
            </div>

            <div className="detail-block">
              <h3>Files</h3>
              {selected.files.length === 0 ? <p className="muted">No files attached.</p> : selected.files.map((file) => <a key={file.name} className="file-link" href={file.url || "#"}>{file.name}</a>)}
            </div>

            <div className="detail-block">
              <h3>Internal notes</h3>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Add notes for the LEAF team..." />
            </div>

            <div className="status-area">
              <div>
                <h3>Status</h3>
                <select value={status} onChange={(event) => setStatus(event.target.value)}>
                  {statuses.map((item) => <option key={item}>{item}</option>)}
                </select>
              </div>
              <button className="save-button" onClick={saveRequest} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
            </div>
            {message && <p className="save-message">{message}</p>}
          </section>
        )}
      </div>

      <style jsx>{adminStyles}</style>
    </main>
  );
}

function Stat({ index, label, value, selected, onClick }: {
  index: number;
  label: string;
  value: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button className={`stat-card stat-index-${index} ${selected ? "selected" : ""}`} onClick={onClick} aria-pressed={selected}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{selected ? "Selected ↑" : "View details ↓"}</small>
    </button>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="info-item"><span>{label}</span><strong>{value}</strong></div>;
}

const adminStyles = `
  .admin-shell { min-height: 100vh; background: #F3F0E7; color: #193024; padding: 70px 24px; }
  .dashboard, .login-card { width: min(1180px, 100%); margin: 0 auto; }
  .login-card { max-width: 500px; margin-top: 10vh; background: #fff; border: 2px solid #D8E0D9; border-radius: 28px; padding: 48px; box-shadow: 0 24px 70px rgba(22,59,39,.12); }
  .leaf-mark { color: #048243; font-size: 2rem; font-weight: 900; margin-bottom: 42px; }
  .admin-eyebrow { color: #048243; font-size: .8rem; letter-spacing: 2px; text-transform: uppercase; font-weight: 900; margin-bottom: 8px; }
  h1, h2, h3, p { margin-top: 0; }
  .login-card h1, .dashboard-header h1, .section-heading h2, .detail-header h2 { font-family: "BPMF Huninn", sans-serif; color: #048243; }
  .login-card h1 { font-size: 3.5rem; line-height: 1; margin-bottom: 16px; }
  .login-card p { color: #657168; line-height: 1.6; }
  .login-card form { margin-top: 28px; }
  .login-card input, .detail-block textarea, .status-area select { width: 100%; border: 2px solid #D8E0D9; border-radius: 12px; background: #fff; padding: 14px 16px; font: inherit; color: #193024; outline: none; }
  .login-card button, .save-button { width: 100%; margin-top: 14px; border: 0; border-radius: 999px; padding: 15px 20px; background: #048243; color: #fff; font: inherit; font-weight: 800; }
  button:disabled { opacity: .55; cursor: not-allowed; }
  .error-message { margin-top: 12px; color: #D11A2A; font-weight: 800; }
  .dashboard-header { display:flex; justify-content:space-between; gap:30px; align-items:flex-start; margin-bottom:38px; }
  .dashboard-header h1 { font-size: clamp(3rem, 7vw, 5rem); line-height: .95; margin-bottom: 14px; }
  .dashboard-header p:last-child { color:#657168; }
  .logout, .refresh, .close-detail { border:2px solid #78A987; background:transparent; color:#048243; border-radius:999px; padding:11px 18px; font-weight:800; }
  .stats-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:16px; margin-bottom:42px; align-items:start; }
  .stat-card { width:100%; min-height:150px; border:2px solid #D8E0D9; border-radius:20px; overflow:hidden; background:#fff; color:#193024; padding:24px; text-align:left; cursor:pointer; transition:border-color .2s ease,background .2s ease,box-shadow .2s ease,transform .12s ease; }
  .stat-card:hover { border-color:#78A987; background:#F7FBF8; }
  .stat-card:active { transform:scale(.97); }
  .stat-card.selected { border-color:#048243; background:#048243; color:#fff; box-shadow:0 10px 26px rgba(4,130,67,.20); animation:statButtonPop .35s cubic-bezier(.22,1,.36,1); }
  .stat-card.selected span, .stat-card.selected strong, .stat-card.selected small { color:#fff; }
  .stat-card span { display:block; color:#657168; font-size:.75rem; font-weight:900; letter-spacing:1.5px; }
  .stat-card strong { display:block; margin-top:10px; color:#048243; font-size:3rem; line-height:1; }
  .stat-card small { display:block; margin-top:16px; color:#657168; font-weight:800; }
  .stat-details-panel { background:#fff; border:2px solid #048243; border-radius:26px; padding:30px; margin:-18px 0 42px; box-shadow:0 12px 30px rgba(4,130,67,.10); animation:statPanelDrop .45s cubic-bezier(.22,1,.36,1) both; }
  .expanded-stat-header { display:flex; justify-content:space-between; align-items:center; gap:20px; border-top:1px solid #E5E7EB; padding-top:24px; }
  .expanded-stat-header h2 { font-family:"BPMF Huninn", sans-serif; color:#048243; font-size:2.6rem; margin:0; }
  .close-stat { border:2px solid #78A987; background:transparent; color:#048243; border-radius:999px; padding:11px 18px; font-weight:800; cursor:pointer; }
  .stat-empty { text-align:center; padding:40px 20px 15px; color:#657168; font-weight:700; }
  @keyframes statButtonPop {
    0% { transform:scale(1); }
    45% { transform:scale(.96); }
    100% { transform:scale(1); }
  }
  @keyframes statPanelDrop { 0% { opacity:0; transform:translateY(-18px); } 100% { opacity:1; transform:translateY(0); } }
  @keyframes statContentReveal {
    0% { opacity:0; transform:translateY(-8px); }
    100% { opacity:1; transform:translateY(0); }
  }
  .request-section, .detail-section { background:#fff; border:2px solid #D8E0D9; border-radius:26px; padding:32px; margin-bottom:28px; }
  .section-heading, .detail-header, .status-area { display:flex; justify-content:space-between; align-items:center; gap:20px; }
  .section-heading h2, .detail-header h2 { font-size:2.8rem; line-height:1; }
  .request-list { margin-top:22px; display:grid; gap:10px; }
  .request-row { width:100%; display:grid; grid-template-columns:130px 1.5fr 110px 140px; align-items:center; gap:16px; padding:17px; border:2px solid #E5E7EB; border-radius:16px; background:#fff; text-align:left; color:#193024; }
  .request-row:hover, .request-row.selected { border-color:#048243; background:#F7FBF8; }
  .request-row small { display:block; color:#657168; margin-top:4px; }
  .request-id { color:#048243; font-weight:900; }
  .status-pill { justify-self:start; padding:7px 11px; border-radius:999px; background:#EAF4ED; color:#048243; font-size:.82rem; font-weight:800; }
  .empty-state { text-align:center; padding:70px 20px 55px; }
  .empty-icon { font-size:3rem; margin-bottom:14px; }
  .empty-state h3 { font-size:1.5rem; margin-bottom:8px; }
  .empty-state p, .muted { color:#657168; }
  .detail-header { margin-bottom:28px; }
  .detail-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
  .info-item { border:2px solid #E5E7EB; border-radius:14px; padding:15px; }
  .info-item span { display:block; color:#657168; font-size:.78rem; font-weight:800; text-transform:uppercase; letter-spacing:1px; margin-bottom:7px; }
  .info-item strong { display:block; overflow-wrap:anywhere; }
  .detail-block { margin-top:28px; }
  .detail-block h3, .status-area h3 { margin-bottom:10px; }
  .description { white-space:pre-wrap; color:#405247; line-height:1.7; background:#F7F8F7; border-radius:14px; padding:18px; }
  .detail-block textarea { min-height:130px; resize:vertical; }
  .file-link { display:inline-block; margin:0 8px 8px 0; padding:9px 12px; border-radius:10px; background:#F3F0E7; color:#048243; font-weight:800; }
  .status-area { margin-top:30px; align-items:flex-end; }
  .status-area > div { width:min(340px,100%); }
  .status-area select { margin-top:4px; }
  .save-button { width:auto; min-width:170px; margin-top:0; }
  .save-message { margin-top:12px; color:#048243; font-weight:800; }
  @media (max-width: 800px) {
    .detail-grid { grid-template-columns:repeat(2,1fr); }
    .request-row { grid-template-columns:1fr 1fr; }
  }
  @media (max-width: 560px) {
    .admin-shell { padding:40px 16px; }
    .login-card, .request-section, .detail-section { padding:22px; }
    .dashboard-header { flex-direction:column; }
    .status-area { flex-direction:column; align-items:stretch; }
    .save-button { width:100%; }
  }
`;
