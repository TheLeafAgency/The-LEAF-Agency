"use client";

import { useEffect, useMemo, useState } from "react";

const statuses = [
  "Untouched",
  "Reviewed",
  "Contacted",
  "Proposal Sent",
  "In Production",
  "Editing",
  "Contacting Agencies",
  "Completed",
  "Urgent",
  "Failed",
  "Declined",
] as const;

const legacyStatusMap: Record<string, string> = {
  New: "Untouched",
  Reviewing: "Reviewed",
  Discussing: "Contacted",
  Approved: "Proposal Sent",
  Publishing: "Contacting Agencies",
};

function displayStatus(status: string) {
  return legacyStatusMap[status] || status;
}

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
  contactSummary?: string;
  estimatedCost?: string;
  estimatedFinishDate?: string;
  progressStatuses?: string[];
  description: string;
  files: { name: string; url?: string }[];
  internalNotes: string;
  failureExplanation?: string;
  proposal?: string;
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
  const [contactSummary, setContactSummary] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [estimatedFinishDate, setEstimatedFinishDate] = useState("");
  const [proposal, setProposal] = useState("");
  const [failureExplanation, setFailureExplanation] = useState("");
  const [status, setStatus] = useState("Untouched");
  const [progressStatuses, setProgressStatuses] = useState<string[]>(["Untouched"]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [expandedStat, setExpandedStat] = useState<string | null>(null);
  const [statusError, setStatusError] = useState("");

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
      setContactSummary(selected.contactSummary || selected.contact || "");
      setEstimatedCost(formatMoney(selected.estimatedCost || selected.budget || ""));
      setEstimatedFinishDate(selected.estimatedFinishDate || selected.deadline || "");
      setProposal(selected.proposal || "");
      setFailureExplanation(selected.failureExplanation || "");
      const currentStatus = displayStatus(selected.status || "Untouched");
      const workflowOrder = ["Untouched", "Reviewed", "Contacted", "Proposal Sent", "In Production", "Editing", "Contacting Agencies"];
      const savedProgress = Array.isArray(selected.progressStatuses) ? selected.progressStatuses : [];
      if (savedProgress.length) {
        setProgressStatuses(savedProgress);
      } else {
        const currentIndex = workflowOrder.indexOf(currentStatus);
        setProgressStatuses(currentIndex >= 0 ? workflowOrder.slice(0, currentIndex + 1) : ["Untouched"]);
      }
      setStatus(currentStatus);
      setMessage("");
    }
  }, [selectedId, selected]);

  const counts = useMemo(() => ({
    newRequests: requests.filter((item) => displayStatus(item.status) === "Untouched").length,
    active: requests.filter((item) => ["Reviewed", "Contacted", "Proposal Sent", "In Production"].includes(displayStatus(item.status))).length,
    postProduction: requests.filter((item) => ["Editing", "Contacting Agencies"].includes(displayStatus(item.status))).length,
    urgent: requests.filter((item) => displayStatus(item.status) === "Urgent").length,
  }), [requests]);

  const expandedRequests = useMemo(() => {
    if (!expandedStat) return [];
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = (item: LeafRequest) => !term || `${item.id} ${item.business}`.toLowerCase().includes(term);
    const sortProjects = (items: LeafRequest[]) => [...items].filter(matchesSearch).sort((a, b) => (a.business || a.id).localeCompare(b.business || b.id));
    if (expandedStat === "new") return sortProjects(requests.filter((item) => displayStatus(item.status) === "Untouched"));
    if (expandedStat === "active") return sortProjects(requests.filter((item) => ["Reviewed", "Contacted", "Proposal Sent", "In Production"].includes(displayStatus(item.status))));
    if (expandedStat === "post-production") return sortProjects(requests.filter((item) => ["Editing", "Contacting Agencies"].includes(displayStatus(item.status))));
    if (expandedStat === "urgent") return sortProjects(requests.filter((item) => displayStatus(item.status) === "Urgent"));
    return [];
  }, [expandedStat, requests, searchTerm]);

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
    setStatusError("");

    if (["Failed", "Declined"].includes(status)) {
      const wordCount = failureExplanation.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount < 30) {
        setLoading(false);
        setStatusError("Please explain why this project was " + status.toLowerCase() + " in at least 30 words. (" + wordCount + "/30 words)");
        return;
      }
    }

    if (status === "Proposal Sent" && !proposal.trim()) {
      setLoading(false);
      setStatusError("Please explain what the proposal was before saving this status.");
      return;
    }

    const response = await fetch("/api/requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selected.id, status, progressStatuses, internalNotes: notes, contactSummary, estimatedCost: estimatedCost.replace(/[^0-9]/g, ""), estimatedFinishDate, proposal, failureExplanation }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.message || "Could not save changes.");
      return;
    }

    setRequests((current) => current.map((item) => item.id === data.request.id ? data.request : item));
    setMessage("Saved.");
    setSelectedId(null);
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
          <Stat index={2} label="POST PRODUCTION" value={counts.postProduction} selected={expandedStat === "post-production"} onClick={() => setExpandedStat(expandedStat === "post-production" ? null : "post-production")} />
          <Stat index={3} label="URGENT" value={counts.urgent} selected={expandedStat === "urgent"} onClick={() => setExpandedStat(expandedStat === "urgent" ? null : "urgent")} />
        </section>

        {expandedStat && (
          <section className="stat-details-panel">
            <div className="expanded-stat-header">
              <div>
                <p className="admin-eyebrow">{expandedStat === "new" ? "NEW REQUESTS" : expandedStat === "active" ? "ACTIVE PROJECTS" : expandedStat === "post-production" ? "POST PRODUCTION" : "URGENT"}</p>
                <h2>{expandedStat === "new" ? "New Requests" : expandedStat === "active" ? "Active Projects" : expandedStat === "post-production" ? "Post Production" : "Urgent"}</h2>
              </div>
              <button className="close-stat" onClick={() => setExpandedStat(null)}>Close ↑</button>
            </div>
            <div className="search-wrap">
              {!searchOpen ? <button className="search-toggle" onClick={() => setSearchOpen(true)}>Search projects 🔎</button> : <input autoFocus className="project-search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search by project or business..." />}
            </div>
            {expandedRequests.length === 0 ? <div className="stat-empty">Nothing here yet.</div> : (
              <div className="request-list">
                {expandedRequests.map((item) => (
                  <button key={item.id} className={`request-row ${selectedId === item.id ? "selected" : ""}`} onClick={() => setSelectedId(item.id)}>
                    <span className="request-id">{item.id}</span>
                    <span><strong>{item.business}</strong><small>{item.service || "Advertising request"}</small></span>
                    <span>{new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    <span className={`status-pill status-${displayStatus(item.status).toLowerCase().replace(/[^a-z]+/g, "-")}`}>{displayStatus(item.status)}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

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
              {progressStatuses.includes("Contacted") && (
                <div className="info-item editable-info-item">
                  <span>Contact conversation</span>
                  <textarea
                    className="inline-edit"
                    value={contactSummary}
                    onChange={(event) => setContactSummary(event.target.value)}
                    placeholder="Short summary of the contact conversation..."
                  />
                </div>
              )}
              <Info label="Email" value={selected.email} />
              <Info label="Phone" value={selected.phone} />
              <Info label="Service" value={selected.service || "Not provided"} />
              <Info label="Location" value={selected.location || selected.zipCode || "Not provided"} />
              <div className="info-item editable-info-item">
                <span>Estimated cost</span>
                <div className="money-input-wrap">
                  <span>$</span>
                  <input
                    className="inline-input money-input"
                    inputMode="numeric"
                    value={estimatedCost}
                    onChange={(event) => {
                      const digits = event.target.value.replace(/[^0-9]/g, "").slice(0, 9);
                      const amount = Number(digits || 0);
                      setEstimatedCost(digits && amount <= 100000000 ? amount.toLocaleString("en-US") : "");
                    }}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="info-item editable-info-item">
                <span>Estimated finish date</span>
                <input
                  className="inline-input"
                  type="date"
                  value={estimatedFinishDate}
                  onChange={(event) => setEstimatedFinishDate(event.target.value)}
                />
              </div>
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
              <textarea
                value={notes}
                onChange={(event) => {
                  setNotes(event.target.value);
                  if (statusError) setStatusError("");
                }}
                placeholder="Add notes for the LEAF team..."
              />
              {status === "Proposal Sent" && (
                <div className="proposal-box">
                  <h3>What was the proposal?</h3>
                  <textarea value={proposal} onChange={(event) => { setProposal(event.target.value); if (statusError) setStatusError(""); }} placeholder="Describe what was proposed to the client..." />
                </div>
              )}
              {["Failed", "Declined"].includes(status) && (
                <div className="failure-box">
                  <h3>Why did this project fail/decline?</h3>
                  <textarea value={failureExplanation} onChange={(event) => { setFailureExplanation(event.target.value); if (statusError) setStatusError(""); }} placeholder="Explain why this project failed/was declined." />
                </div>
              )}
              {["Failed", "Declined"].includes(status) && (
                <p className="status-requirement">
                  A minimum of 30 words is required before this project can be marked {status.toLowerCase()}.
                </p>
              )}
            </div>

            <div className="status-area">
              <div className="status-workflow">
                <h3>Project progress</h3>
                <ProgressChecklist
                  checked={progressStatuses}
                  onChange={(next) => {
                    setProgressStatuses(next);
                    const workflowStatuses = ["Untouched", "Reviewed", "Contacted", "Proposal Sent", "In Production", "Editing", "Contacting Agencies"];
                    const lastChecked = workflowStatuses.filter((item) => next.includes(item)).pop() || "Untouched";
                    setStatus(lastChecked);
                  }}
                />
              </div>
              <div className="status-final">
                <h3>Final status</h3>
                <FinalStatusPicker value={["Untouched", "Completed", "Failed", "Declined"].includes(status) ? status : ""} onChange={setStatus} />
              </div>
              <button className="save-button" onClick={saveRequest} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
            </div>
            {statusError && <p className="status-error">{statusError}</p>}
            {message && <p className="save-message">{message}</p>}
          </section>
        )}

        <section className="request-section history-section completed-history">
          <div className="section-heading">
            <div>
              <p className="admin-eyebrow">Completed projects!</p>
              <h2>Completed projects!</h2>
            </div>
            <button className="refresh" onClick={() => loadRequests()}>Refresh</button>
          </div>

          {requests.filter((item) => displayStatus(item.status) === "Completed").length === 0 ? (
            <div className="empty-state compact-empty"><h3>No completed projects yet.</h3><p>Completed projects will stay here as part of your project history.</p></div>
          ) : (
            <div className="request-list">
              {requests.filter((item) => displayStatus(item.status) === "Completed").map((item) => (
                <button key={item.id} className={`request-row ${selectedId === item.id ? "selected" : ""}`} onClick={() => setSelectedId(item.id)}>
                  <span className="request-id">{item.id}</span>
                  <span><strong>{item.business}</strong><small>{item.service || "Advertising request"}</small></span>
                  <span>{new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  <span className="status-pill status-completed">Completed</span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="request-section history-section failed-history">
          <div className="section-heading">
            <div>
              <p className="admin-eyebrow">Failed & declined</p>
              <h2>Failed & Declined Projects</h2>
            </div>
          </div>

          {requests.filter((item) => ["Failed", "Declined"].includes(displayStatus(item.status))).length === 0 ? (
            <div className="empty-state compact-empty"><h3>No failed or declined projects.</h3><p>Projects that fail or are declined will be kept here for reference.</p></div>
          ) : (
            <div className="request-list">
              {requests.filter((item) => ["Failed", "Declined"].includes(displayStatus(item.status))).map((item) => (
                <button key={item.id} className={`request-row ${selectedId === item.id ? "selected" : ""}`} onClick={() => setSelectedId(item.id)}>
                  <span className="request-id">{item.id}</span>
                  <span><strong>{item.business}</strong><small>{item.service || "Advertising request"}</small></span>
                  <span>{new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  <span className={`status-pill status-${displayStatus(item.status).toLowerCase().replace(/[^a-z]+/g, "-")}`}>{displayStatus(item.status)}</span>
                </button>
              ))}
            </div>
          )}
        </section>
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

function formatMoney(value: string) {
  const digits = value.replace(/[^0-9]/g, "");
  return digits ? Number(digits).toLocaleString("en-US") : "";
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="info-item"><span>{label}</span><strong>{value}</strong></div>;
}

function ProgressChecklist({ checked, onChange }: { checked: string[]; onChange: (value: string[]) => void }) {
  const workflowStatuses = ["Untouched", "Reviewed", "Contacted", "Proposal Sent", "In Production", "Editing", "Contacting Agencies"];

  return (
    <div className="progress-checklist">
      {workflowStatuses.map((item) => {
        const isChecked = checked.includes(item);
        return (
          <label key={item} className={`checklist-item ${isChecked ? "checked" : ""}`}>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onChange(isChecked ? checked.filter((value) => value !== item) : [...checked, item])}
            />
            <span className="checklist-box" aria-hidden="true">{isChecked ? "✓" : ""}</span>
            <span>{item}</span>
          </label>
        );
      })}
    </div>
  );
}

function StatusPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const workflowStatuses = ["Untouched", "Reviewed", "Contacted", "Proposal Sent", "In Production", "Editing", "Contacting Agencies"];

  return (
    <div className={`status-picker ${open ? "open" : ""}`}>
      <button type="button" className="status-picker-button" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <span>{value}</span>
        <span className="status-picker-arrow">{open ? "↑" : "☷"}</span>
      </button>
      {open && (
        <div className="status-picker-menu">
          <p className="status-picker-label">Project progress</p>
          {workflowStatuses.map((item) => (
            <button
              type="button"
              key={item}
              className={`status-option ${item === value ? "checked" : ""}`}
              onClick={() => { onChange(item); setOpen(false); }}
            >
              <span className="status-option-left">
                <span className="status-checkbox" aria-hidden="true">{item === value ? "✓" : ""}</span>
                <span>{item}</span>
              </span>
              {item === value && <span className="status-current">Current</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FinalStatusPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const finalStatuses = ["Completed", "Failed", "Declined"];

  return (
    <div className={`status-picker final-status-picker ${open ? "open" : ""}`}>
      <button type="button" className="status-picker-button" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <span>{finalStatuses.includes(value) ? value : "Choose final status"}</span>
        <span className="status-picker-arrow">{open ? "↑" : "☷"}</span>
      </button>
      {open && (
        <div className="status-picker-menu">
          <p className="status-picker-label">Final status</p>
          {finalStatuses.map((item) => (
            <button
              type="button"
              key={item}
              className={`status-option ${item === value ? "checked" : ""}`}
              onClick={() => { onChange(item); setOpen(false); }}
            >
              <span className="status-option-left">
                <span className="status-checkbox" aria-hidden="true">{item === value ? "✓" : ""}</span>
                <span>{item}</span>
              </span>
              {item === value && <span className="status-current">Current</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
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
  @keyframes statButtonPop { 0% { transform:scale(1); } 45% { transform:scale(.96); } 100% { transform:scale(1); } }
  @keyframes statPanelDrop { 0% { opacity:0; transform:translateY(-18px); } 100% { opacity:1; transform:translateY(0); } }
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
  .editable-info-item { display:flex; flex-direction:column; }
  .inline-edit, .inline-input { width:100%; border:0; background:transparent; color:#193024; font:inherit; outline:none; padding:0; resize:vertical; }
  .inline-edit { min-height:72px; line-height:1.5; }
  .inline-input { min-height:32px; font-weight:800; }
  .inline-input[type="date"] { min-height:48px; padding:10px 12px; border:2px solid #D8E0D9; border-radius:12px; background:#F7FBF8; color:#193024; accent-color:#048243; font-size:1rem; cursor:pointer; }
  .inline-input[type="date"]:focus { border-color:#048243; box-shadow:0 0 0 4px rgba(4,130,67,.08); }
  .inline-input[type="date"]::-webkit-calendar-picker-indicator { width:24px; height:24px; padding:3px; cursor:pointer; }
  .progress-checklist { display:grid; gap:8px; margin-top:4px; }
  .checklist-item { display:flex; align-items:center; gap:11px; padding:11px 12px; border:2px solid #D8E0D9; border-radius:12px; background:#fff; color:#193024; font-weight:800; cursor:pointer; transition:.15s ease; }
  .checklist-item:hover { border-color:#78A987; background:#F7FBF8; }
  .checklist-item.checked { border-color:#048243; background:#EAF4ED; color:#048243; }
  .checklist-item input { position:absolute; opacity:0; pointer-events:none; }
  .checklist-box { width:22px; height:22px; display:inline-flex; align-items:center; justify-content:center; border:2px solid #B8C5BC; border-radius:5px; background:#fff; color:#048243; font-size:.8rem; font-weight:900; flex:0 0 22px; }
  .checklist-item.checked .checklist-box { border-color:#048243; background:#fff; }
  .money-input-wrap { display:flex; align-items:center; color:#193024; font-weight:800; }
  .money-input-wrap > span { margin-right:2px; }
  .detail-block { margin-top:28px; }
  .detail-block h3, .status-area h3 { margin-bottom:10px; }
  .description { white-space:pre-wrap; color:#405247; line-height:1.7; background:#F7F8F7; border-radius:14px; padding:18px; }
  .detail-block textarea { min-height:130px; resize:vertical; }
  .file-link { display:inline-block; margin:0 8px 8px 0; padding:9px 12px; border-radius:10px; background:#F3F0E7; color:#048243; font-weight:800; }
  .status-area { margin-top:30px; align-items:flex-end; }
  .status-workflow { width:min(340px,100%); }
  .status-final { margin-left:auto; width:min(340px,100%); text-align:right; }
  .status-final h3 { text-align:right; }
  .status-picker { position:relative; margin-top:4px; }
  .status-picker-button { width:100%; display:flex; justify-content:space-between; align-items:center; gap:12px; border:2px solid #D8E0D9; border-radius:14px; background:#fff; color:#193024; padding:14px 16px; font:inherit; font-weight:800; cursor:pointer; }
  .status-picker-button:hover, .status-picker.open .status-picker-button { border-color:#048243; box-shadow:0 0 0 4px rgba(4,130,67,.08); }
  .status-picker-arrow { color:#048243; font-size:1rem; }
  .status-picker-menu { position:absolute; z-index:20; right:0; left:auto; width:100%; bottom:calc(100% + 8px); top:auto; padding:8px; border:2px solid #D8E0D9; border-radius:16px; background:#fff; box-shadow:0 18px 40px rgba(22,59,39,.16); max-height:360px; overflow:auto; }
  .status-picker-label { margin:4px 8px 8px; color:#657168; font-size:.75rem; font-weight:900; letter-spacing:1px; text-transform:uppercase; }
  .status-option { width:100%; display:flex; align-items:center; justify-content:space-between; border:0; border-radius:11px; background:transparent; color:#193024; padding:11px 12px; text-align:left; font:inherit; font-weight:800; cursor:pointer; }
  .status-option:hover:not(:disabled), .status-option.checked { background:#EAF4ED; color:#048243; }
  .status-option-left { display:flex; align-items:center; gap:10px; }
  .status-checkbox { width:20px; height:20px; display:inline-flex; align-items:center; justify-content:center; border:2px solid #B8C5BC; border-radius:5px; background:#fff; color:#048243; font-size:.78rem; font-weight:900; flex:0 0 20px; }
  .status-option.checked .status-checkbox { border-color:#048243; background:#EAF4ED; }
  .status-current { color:#048243; font-size:.72rem; font-weight:900; text-transform:uppercase; letter-spacing:.7px; }
  .compact-empty { padding:48px 20px; }
  .history-section { margin-top:28px; }
  .completed-history { border-color:#048243; background:#fff; color:#193024; }
  .completed-history .admin-eyebrow, .completed-history h2 { color:#048243; }
  .completed-history .request-row { background:#fff; color:#193024; }
  .completed-history .request-row:hover, .completed-history .request-row.selected { border-color:#048243; background:#F7FBF8; }
  .failed-history { border-color:#B3122D; background:#fff; color:#193024; }
  .failed-history .admin-eyebrow, .failed-history h2 { color:#B3122D; }
  .failed-history .request-row { background:#fff; color:#193024; }
  .failed-history .request-row:hover, .failed-history .request-row.selected { border-color:#B3122D; background:#FFF5F6; }
  .search-wrap { margin-top:18px; }
  .search-toggle { border:2px solid #78A987; background:#fff; color:#048243; border-radius:999px; padding:10px 16px; font-weight:800; cursor:pointer; }
  .project-search { width:100%; border:2px solid #048243; border-radius:14px; background:#fff; color:#193024; padding:13px 16px; font:inherit; outline:none; }
  .proposal-box, .failure-box { margin-top:22px; }
  .proposal-box h3, .failure-box h3 { margin-bottom:10px; }
  .failure-box textarea { border-color:#B3122D; }
  .status-requirement { margin:8px 0 0; color:#657168; font-size:.9rem; font-weight:700; }
  .status-error { margin-top:12px; color:#D11A2A; font-weight:800; }
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
    .status-workflow, .status-final { width:100%; margin-left:0; text-align:left; }
    .status-final h3 { text-align:left; }
    .status-picker-menu { left:0; right:0; width:100%; }
    .save-button { width:100%; }
  }
`;
