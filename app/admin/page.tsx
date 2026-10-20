"use client";

import { useEffect, useMemo, useState } from "react";

const statuses = [
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
  "Unfinished",
  "Spam",
] as const;

function isOverdue(dateString: string, status?: string) {
  if (["Completed", "Failed", "Declined"].includes(status || "")) return false;
  const match = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;
  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return false;
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return date.getTime() < todayStart.getTime();
}

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
  spamReview?: boolean;
  isSpam?: boolean;
  spamRemovedAt?: string;
  statusChangedAt?: string;
  archivedAt?: string;
  archiveReason?: string;
  spamReasons?: string[];
  isUrgent?: boolean;
};

const workflowStatuses = ["Reviewed", "Contacted", "Proposal Sent", "In Production", "Editing", "Contacting Agencies"];

function getProjectStage(item: LeafRequest) {
  const savedStatus = displayStatus(item.status);
  if (savedStatus === "Unfinished") return workflowStatuses.filter((step) => (item.progressStatuses || []).includes(step)).pop() || "Untouched";
  return savedStatus;
}

function hasWorkflowProgress(item: LeafRequest) {
  return (item.progressStatuses || []).some((step) => workflowStatuses.includes(step));
}

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
  const [progressStatuses, setProgressStatuses] = useState<string[]>([]);
  const [isUrgent, setIsUrgent] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [organizerSearch, setOrganizerSearch] = useState("");
  const [organizerOpen, setOrganizerOpen] = useState(false);
  const [spamConfirmStep, setSpamConfirmStep] = useState<0 | 1 | 2>(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [expandedStat, setExpandedStat] = useState<string | null>(null);
  const [statusError, setStatusError] = useState("");

  function openRequest(id: string) {
    setSelectedId(id);
    window.setTimeout(() => {
      document.querySelector(".detail-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 40);
  }

  function closeRequest() {
    setSelectedId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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
  const spamRequests = requests.filter((item) => item.isSpam === true && !item.spamRemovedAt);
  const newRequestItems = requests.filter((item) => item.isSpam !== true && !item.archivedAt && !item.isUrgent && !["Completed", "Failed", "Declined", "Urgent", "Spam"].includes(displayStatus(item.status)) && getProjectStage(item) === "Untouched" && !hasWorkflowProgress(item));
  const projectHistory = requests.filter((item) => Boolean(item.archivedAt) || item.isSpam === true || ["Completed", "Failed", "Declined"].includes(displayStatus(item.status)));
  const organizerResults = organizerSearch.trim() ? requests.filter((item) => `${item.id} ${item.business}`.toLowerCase().includes(organizerSearch.trim().toLowerCase())).sort((a, b) => (a.business || a.id).localeCompare(b.business || b.id)) : [];

  useEffect(() => {
    if (selected) {
      setNotes(selected.internalNotes || "");
      setContactSummary(selected.contactSummary || selected.contact || "");
      setEstimatedCost(formatMoney(selected.estimatedCost || selected.budget || ""));
      setEstimatedFinishDate(selected.estimatedFinishDate || selected.deadline || "");
      setProposal(selected.proposal || "");
      setFailureExplanation(selected.failureExplanation || "");
      const currentStatus = displayStatus(selected.status || "Untouched");
      const workflowOrder = ["Reviewed", "Contacted", "Proposal Sent", "In Production", "Editing", "Contacting Agencies"];
      const savedProgress = Array.isArray(selected.progressStatuses) ? selected.progressStatuses : [];
      if (savedProgress.length) {
        setProgressStatuses(savedProgress);
      } else {
        const currentIndex = workflowOrder.indexOf(currentStatus);
        setProgressStatuses(currentIndex >= 0 ? workflowOrder.slice(0, currentIndex + 1) : []);
      }
      setStatus(currentStatus);
      setIsUrgent(Boolean(selected.isUrgent));
      setMessage("");
    }
  }, [selectedId, selected]);

  const counts = useMemo(() => ({
    newRequests: requests.filter((item) => item.isSpam !== true && !item.archivedAt && !item.isUrgent && !["Completed", "Failed", "Declined", "Urgent", "Spam"].includes(displayStatus(item.status)) && getProjectStage(item) === "Untouched" && !hasWorkflowProgress(item)).length,
    active: requests.filter((item) => !item.archivedAt && !item.isSpam && ["Reviewed", "Contacted", "Proposal Sent", "In Production"].includes(getProjectStage(item))).length,
    postProduction: requests.filter((item) => !item.archivedAt && !item.isSpam && ["Editing", "Contacting Agencies"].includes(getProjectStage(item))).length,
    urgent: requests.filter((item) => !item.archivedAt && !item.isSpam && (item.isUrgent === true || displayStatus(item.status) === "Urgent" || isOverdue(item.estimatedFinishDate || item.deadline || "", item.status))).length,
  }), [requests]);

  const expandedRequests = useMemo(() => {
    if (!expandedStat) return [];
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = (item: LeafRequest) => !term || `${item.id} ${item.business}`.toLowerCase().includes(term);
    const sortProjects = (items: LeafRequest[]) => [...items].filter(matchesSearch).sort((a, b) => (a.business || a.id).localeCompare(b.business || b.id));
    if (expandedStat === "new") return sortProjects(requests.filter((item) => item.isSpam !== true && !item.archivedAt && !item.isUrgent && !["Completed", "Failed", "Declined", "Urgent", "Spam"].includes(displayStatus(item.status)) && getProjectStage(item) === "Untouched" && !hasWorkflowProgress(item)));
    if (expandedStat === "active") return sortProjects(requests.filter((item) => !item.archivedAt && !item.isSpam && ["Reviewed", "Contacted", "Proposal Sent", "In Production"].includes(getProjectStage(item)) && !isOverdue(item.estimatedFinishDate || item.deadline || "", item.status)));
    if (expandedStat === "post-production") return sortProjects(requests.filter((item) => !item.archivedAt && !item.isSpam && ["Editing", "Contacting Agencies"].includes(getProjectStage(item))));
    if (expandedStat === "urgent") return sortProjects(requests.filter((item) => !item.archivedAt && !item.isSpam && (item.isUrgent === true || displayStatus(item.status) === "Urgent" || isOverdue(item.estimatedFinishDate || item.deadline || "", item.status))).sort((a, b) => Number(isOverdue(b.estimatedFinishDate || b.deadline || "")) - Number(isOverdue(a.estimatedFinishDate || a.deadline || ""))));
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

  async function moveToSpam(item: LeafRequest) {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, markSpam: true }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Could not move this request to Spam.");
        return;
      }
      setRequests((current) => current.map((request) => request.id === item.id ? data.request : request));
      if (selectedId === item.id) setSelectedId(null);
      setMessage(`${item.id} moved to Spam.`);
    } catch {
      setMessage("Could not move this request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function startSpamRemoval() {
    if (spamRequests.length === 0) return;
    setSpamConfirmStep(1);
  }

  function cancelSpamRemoval() {
    setSpamConfirmStep(0);
  }

  async function removeAllSpam() {
    if (spamRequests.length === 0) return;
    setSpamConfirmStep(0);
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/requests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ allSpam: true }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Could not remove Spam projects.");
        return;
      }
      setRequests(data.requests || []);
      if (selected && selected.isSpam) setSelectedId(null);
      setMessage(`${data.removedCount ?? spamRequests.length} project(s) removed from Spam and preserved in Project History.`);
    } catch {
      setMessage("Could not remove Spam projects. Please try again.");
    } finally {
      setLoading(false);
    }
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
      body: JSON.stringify({ id: selected.id, status, progressStatuses, isUrgent, internalNotes: notes, contactSummary, estimatedCost: estimatedCost.replace(/[^0-9]/g, ""), estimatedFinishDate, proposal, failureExplanation }),
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
          <div className="dashboard-title-block">
            <p className="admin-eyebrow">LEAF Agency</p>
            <h1>LEAF Dashboard</h1>
            <div className={`find-project-control ${organizerOpen ? "is-open" : ""}`}>
              <button
                type="button"
                className="find-project-toggle"
                onClick={() => {
                  setOrganizerOpen((open) => !open);
                  if (organizerOpen) setOrganizerSearch("");
                }}
                aria-expanded={organizerOpen}
                aria-controls="find-project-search"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.2 4.2" /></svg>
                <span>Find Project</span>
              </button>
              <div className="find-project-expansion">
                <input
                  id="find-project-search"
                  className="project-search"
                  value={organizerSearch}
                  onChange={(event) => setOrganizerSearch(event.target.value)}
                  placeholder="Project number or name"
                  aria-label="Find project by project number or name"
                  tabIndex={organizerOpen ? 0 : -1}
                />
              </div>
            </div>
            <p>Customer requests for advertising, organized in one place.</p>
          </div>
          <button className="logout" onClick={logout}>Log out</button>
        </header>

        {organizerOpen && organizerSearch.trim() && (
          <section className="find-project-results" aria-live="polite">
            {organizerResults.length === 0 ? <div className="stat-empty">No matching projects found.</div> : (
              <div className="request-list organizer-results">
                {organizerResults.map((item) => (
                  <button key={item.id} className={`request-row ${selectedId === item.id ? "selected" : ""}`} onClick={() => openRequest(item.id)}>
                    <span className="request-id">{item.id}</span>
                    <span><strong>{item.business || "Unnamed business"}</strong><small>{item.service || "Advertising request"}</small></span>
                    <span>{new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span className={`status-pill status-${(item.isSpam ? "spam" : item.archiveReason || displayStatus(item.status)).toLowerCase().replace(/[^a-z]+/g, "-")}`}>{item.isSpam ? (item.spamRemovedAt ? "Spam · History" : "Spam") : item.archivedAt ? "History · " + (item.archiveReason || displayStatus(item.status)) : displayStatus(item.status)}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

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
                  <button key={item.id} className={`request-row ${selectedId === item.id ? "selected" : ""}`} onClick={() => openRequest(item.id)}>
                    <span className="request-id">{item.id}</span>
                    <span><strong>{item.business}</strong><small>{item.service || "Advertising request"}</small></span>
                    <span>{new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    <span className={`status-pill status-${(isOverdue(item.estimatedFinishDate || item.deadline || "", item.status) ? "urgent" : displayStatus(item.status)).toLowerCase().replace(/[^a-z]+/g, "-")}`}>{isOverdue(item.estimatedFinishDate || item.deadline || "", item.status) ? "Urgent" : displayStatus(item.status)}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="request-section new-requests-section">
          <div className="section-heading">
            <div>
              <p className="admin-eyebrow">Review every submission</p>
              <h2>New Requests <span className="spam-count">{newRequestItems.length}</span></h2>
              <p className="spam-intro">Open a request to choose its project progress. If it is spam or junk, move it to the separate Spam section.</p>
            </div>
            <button className="refresh" disabled={loading} onClick={() => loadRequests()}>Refresh</button>
          </div>

          {newRequestItems.length === 0 ? (
            <div className="empty-state compact-empty"><h3>No new requests.</h3><p>New customer submissions will appear here.</p></div>
          ) : (
            <div className="spam-review-list">
              {newRequestItems.map((item) => (
                <article key={item.id} className="spam-review-card">
                  <div className="spam-review-main">
                    <p className="request-id">{item.id} · {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    <h3>{item.business || "Unnamed business"}</h3>
                    <p className="spam-contact"><strong>Email:</strong> {item.email || "Not provided"} <span>·</span> <strong>Phone:</strong> {item.phone || "Not provided"}</p>
                    <p className="spam-description">{item.description || "No description provided."}</p>
                    <button className="spam-review-link" onClick={() => openRequest(item.id)}>Review request and choose progress</button>
                  </div>
                  <div className="spam-review-actions">
                    <button className="trash-button" disabled={loading} onClick={() => moveToSpam(item)}>Move to Spam</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>



        {selected && (
          <section className="detail-section detail-section-enter">
            <div className="detail-header">
              <div>
                <p className="admin-eyebrow">Request details</p>
                <h2>{selected.id}</h2>
              </div>
              <button className="close-detail" onClick={closeRequest}>Close</button>
            </div>

            <div className="detail-grid">
              <Info label="Business" value={selected.business} />
              <div className="info-item editable-info-item contact-conversation-item">
                <span>Contact conversation</span>
                <textarea
                  className="inline-edit"
                  value={contactSummary}
                  disabled={!progressStatuses.includes("Contacted")}
                  onChange={(event) => setContactSummary(event.target.value)}
                  placeholder={progressStatuses.includes("Contacted") ? "Short summary of the contact conversation..." : "Locked until Contacted is checked."}
                />
              </div>
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
                      const digits = event.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                      const amount = Number(digits || 0);
                      setEstimatedCost(digits && amount <= 1000000000 ? amount.toLocaleString("en-US") : "");
                    }}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="info-item editable-info-item">
                <span>{status === "Completed" ? "Finished date" : "Estimated finish date"}{status !== "Completed" && isOverdue(estimatedFinishDate, status) && <em className="overdue-label">* overdue!</em>}</span>
                <input
                  className="inline-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  value={estimatedFinishDate}
                  onChange={(event) => {
                    const digits = event.target.value.replace(/[^0-9]/g, "").slice(0, 8);
                    let formatted = digits;
                    if (digits.length > 2) formatted = digits.slice(0, 2) + "/" + digits.slice(2);
                    if (digits.length > 4) formatted = formatted.slice(0, 5) + "/" + digits.slice(4);
                    setEstimatedFinishDate(formatted);
                  }}
                  placeholder="__/__/____"
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
              {progressStatuses.includes("Proposal Sent") && (
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
                    const workflowStatuses = ["Reviewed", "Contacted", "Proposal Sent", "In Production", "Editing", "Contacting Agencies"];
                    const lastChecked = workflowStatuses.filter((item) => next.includes(item)).pop() || "Untouched";
                    setStatus((current) => current === "Unfinished" ? "Unfinished" : lastChecked);
                  }}
                />
                <div className="urgent-toggle-row">
                  <div>
                    <h4>Urgent</h4>
                    <p>Flag this project so it appears in the Urgent section of the dashboard.</p>
                  </div>
                  <label className="urgent-switch" aria-label="Mark project as urgent">
                    <input type="checkbox" checked={isUrgent} onChange={(event) => setIsUrgent(event.target.checked)} />
                    <span className="urgent-switch-track"><span /></span>
                  </label>
                </div>
              </div>
              <div className="status-final">
                <h3>Final status</h3>
                <FinalStatusPicker value={["Untouched", "Completed", "Failed", "Declined", "Unfinished", "Spam"].includes(status) ? status : ""} onChange={setStatus} />
              </div>
              <button className="save-button" onClick={saveRequest} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
            </div>
            {statusError && <p className="status-error">{statusError}</p>}
            {message && <p className="save-message">{message}</p>}
          </section>
        )}

                <section className="request-section spam-review-section">
          <div className="section-heading">
            <div>
              <p className="admin-eyebrow">Projects you marked as spam</p>
              <h2>Spam <span className="spam-count">{spamRequests.length}</span></h2>
              <p className="spam-intro">Only projects you explicitly move here are included. Check everything before using Remove All Projects. Removed items stay saved in Project History.</p>
            </div>
            <button className="refresh" disabled={loading} onClick={() => loadRequests()}>Refresh</button>
          </div>

          <div className="spam-bulk-actions">
            <button className="remove-all-spam-button" disabled={loading || spamRequests.length === 0} onClick={startSpamRemoval}>Remove All Projects</button>
          </div>

          {spamRequests.length === 0 ? (
            <div className="empty-state compact-empty"><h3>Spam is empty.</h3><p>When you mark a request as spam or junk, it will appear here.</p></div>
          ) : (
            <div className="spam-review-list">
              {spamRequests.map((item) => (
                <article key={item.id} className="spam-review-card">
                  <div className="spam-review-main">
                    <p className="request-id">{item.id} · {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    <h3>{item.business || "Unnamed business"}</h3>
                    <p className="spam-contact"><strong>Email:</strong> {item.email || "Not provided"} <span>·</span> <strong>Phone:</strong> {item.phone || "Not provided"}</p>
                    <p className="spam-reasons"><strong>Review flags:</strong> {(item.spamReasons || []).map((reason) => reason === "invalid_email_format" ? "Email format looks invalid" : reason === "invalid_phone_number" ? "Phone number may be invalid or fictional" : reason === "suspicious_links" ? "Several links in the description" : reason).join("; ") || "Manually marked as spam / junk"}</p>
                    <p className="spam-description">{item.description || "No description provided."}</p>
                    <button className="spam-review-link" onClick={() => openRequest(item.id)}>Review full request</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="request-section history-section project-history-section">
          <div className="section-heading">
            <div>
              <p className="admin-eyebrow">Archived projects</p>
              <h2>Project History <span className="spam-count">{projectHistory.length}</span></h2>
              <p className="spam-intro">This is your long-term record of spam, completed projects, and failed or declined projects. Use the organizer above to find a project by number or name.</p>
            </div>
            <button className="refresh" disabled={loading} onClick={() => loadRequests()}>Refresh</button>
          </div>
          {projectHistory.length === 0 ? (
            <div className="empty-state compact-empty"><h3>No project history yet.</h3><p>Spam, completed projects, and failed or declined projects will appear here.</p></div>
          ) : (
            <div className="request-list">
              {[...projectHistory].sort((a,b) => Date.parse(b.archivedAt || b.statusChangedAt || b.createdAt) - Date.parse(a.archivedAt || a.statusChangedAt || a.createdAt)).map((item) => (
                <button key={item.id} className={`request-row ${selectedId === item.id ? "selected" : ""}`} onClick={() => openRequest(item.id)}>
                  <span className="request-id">{item.id}</span>
                  <span><strong>{item.business}</strong><small>{item.service || "Advertising request"}</small></span>
                  <span>{new Date(item.archivedAt || item.statusChangedAt || item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  <span className={`status-pill status-${(item.archiveReason || displayStatus(item.status)).toLowerCase().replace(/[^a-z]+/g, "-")}`}>{item.isSpam ? "Spam" : item.archiveReason || displayStatus(item.status)}</span>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      {spamConfirmStep > 0 && (
        <div className="leaf-confirm-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) cancelSpamRemoval();
        }}>
          <section className="leaf-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="spam-confirm-title">
            <div className="leaf-confirm-mark" aria-hidden="true">
              <svg viewBox="0 0 64 64"><path d="M49 10C27 10 12 19 12 36c0 9 7 15 15 15 17 0 25-19 22-41Z" /><path d="M13 52c8-13 17-22 31-33" /></svg>
            </div>
            <p className="admin-eyebrow">LEAF Project Care</p>
            {spamConfirmStep === 1 ? (
              <>
                <h2 id="spam-confirm-title">A quick review first</h2>
                <p>Have you reviewed all <strong>{spamRequests.length} projects</strong> in Spam and confirmed none should be kept?</p>
                <p className="leaf-confirm-note">Nothing will be removed yet. You can cancel and return to the list.</p>
                <div className="leaf-confirm-actions">
                  <button type="button" className="leaf-confirm-secondary" onClick={cancelSpamRemoval}>Go back</button>
                  <button type="button" className="leaf-confirm-primary" onClick={() => setSpamConfirmStep(2)}>Yes, I reviewed them</button>
                </div>
              </>
            ) : (
              <>
                <h2 id="spam-confirm-title">Move these projects to history?</h2>
                <p>Remove all <strong>{spamRequests.length} projects</strong> from the Spam section?</p>
                <p className="leaf-confirm-note"><strong>They will stay saved in Project History.</strong> Projects outside Spam will not be affected.</p>
                <div className="leaf-confirm-actions">
                  <button type="button" className="leaf-confirm-secondary" onClick={cancelSpamRemoval}>Cancel</button>
                  <button type="button" className="leaf-confirm-primary" disabled={loading} onClick={removeAllSpam}>{loading ? "Saving..." : "Confirm removal"}</button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
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
  const workflowStatuses = ["Reviewed", "Contacted", "Proposal Sent", "In Production", "Editing", "Contacting Agencies"];

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
  const workflowStatuses = ["Reviewed", "Contacted", "Proposal Sent", "In Production", "Editing", "Contacting Agencies"];

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
  const finalStatuses = ["Completed", "Failed", "Declined", "Unfinished", "Spam"];

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
  .stat-card.stat-index-3.selected { border-color:#E67E22; background:#E67E22; color:#fff; box-shadow:0 10px 26px rgba(230,126,34,.22); }
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
  .inline-input[type="text"] { min-height:48px; padding:10px 12px; border:2px solid #D8E0D9; border-radius:12px; background:#fff; color:#193024; font-size:1rem; }
  .inline-input[type="text"]:focus { border-color:#048243; box-shadow:0 0 0 4px rgba(4,130,67,.08); }
  .inline-edit:disabled { opacity:1; background:#fff; color:#193024; border-color:#D8E0D9; cursor:not-allowed; }
  .contact-conversation-item .inline-edit:not(:disabled) { background:#fff; color:#193024; border-color:#D8E0D9; }
  .overdue-label { color:#B3122D; font-style:normal; font-weight:900; margin-left:7px; text-transform:none; letter-spacing:0; }
  .progress-checklist { display:grid; gap:8px; margin-top:4px; }
  .checklist-item { display:flex; align-items:center; gap:11px; padding:11px 12px; border:2px solid #D8E0D9; border-radius:12px; background:#fff; color:#193024; font-weight:800; cursor:pointer; transition:.15s ease; }
  .checklist-item:hover { border-color:#78A987; background:#F7FBF8; }
  .checklist-item.checked { border-color:#048243; background:#EAF4ED; color:#048243; }
  .checklist-item input { position:absolute; opacity:0; pointer-events:none; }
  .checklist-box { width:22px; height:22px; display:inline-flex; align-items:center; justify-content:center; border:2px solid #B8C5BC; border-radius:5px; background:#fff; color:#048243; font-size:.8rem; font-weight:900; flex:0 0 22px; }
  .checklist-item.checked .checklist-box { border-color:#048243; background:#fff; }
  .detail-section-enter { animation: detailReveal .22s ease-out; }
  @keyframes detailReveal { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @media (prefers-reduced-motion: reduce) { .detail-section-enter { animation:none; } }
  .money-input-wrap { display:flex; align-items:center; color:#193024; font-weight:800; }
  .money-input-wrap > span { margin-right:6px; }
  .money-input { width:165px; min-height:42px; padding:8px 12px; border:2px solid #D8E0D9; border-radius:10px; background:#fff; color:#193024; font:inherit; font-weight:800; outline:none; }
  .money-input:focus { border-color:#048243; box-shadow:0 0 0 4px rgba(4,130,67,.08); }
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
  .project-organizer-section { margin-top:28px; }
  .organizer-search-wrap { margin-top:18px; }
  .organizer-results { margin-top:16px; }
  .project-history-section { margin-top:28px; border-color:#CBD8CD; background:#F9FCF9; }
  .project-history-section .section-heading h2 { color:#193024; }
  .new-requests-section { margin-top:28px; }
  .spam-bulk-actions { display:flex; justify-content:flex-end; margin-top:18px; }
  .remove-all-spam-button { border:0; border-radius:999px; padding:13px 18px; background:#B3122D; color:#fff; font:inherit; font-weight:900; cursor:pointer; }
  .remove-all-spam-button:disabled { opacity:.45; cursor:not-allowed; }
  .spam-review-section { margin-top:28px; border-color:#D8B36A; background:#FFFDF7; }
  .spam-review-section .section-heading h2 { color:#7A4A00; }
  .spam-count { display:inline-flex; align-items:center; justify-content:center; min-width:30px; height:30px; margin-left:8px; padding:0 8px; border-radius:999px; background:#F7E8C8; color:#7A4A00; font:800 .95rem/1 sans-serif; vertical-align:middle; }
  .spam-intro { max-width:760px; color:#657168; line-height:1.6; }
  .spam-review-list { display:grid; gap:14px; margin-top:18px; }
  .spam-review-card { display:flex; justify-content:space-between; align-items:flex-start; gap:24px; padding:22px; border:1px solid #E7D4AE; border-radius:18px; background:#fff; }
  .spam-review-main { min-width:0; flex:1; }
  .spam-review-main h3 { margin:8px 0; color:#193024; font-size:1.25rem; }
  .spam-contact, .spam-reasons, .spam-description { margin:8px 0; color:#536158; line-height:1.55; overflow-wrap:anywhere; }
  .spam-reasons { color:#7A4A00; }
  .spam-description { white-space:pre-wrap; }
  .spam-review-link { margin-top:8px; border:0; background:transparent; color:#048243; font-weight:800; text-decoration:underline; cursor:pointer; }
  .spam-review-actions { display:flex; flex-direction:column; gap:10px; width:230px; flex-shrink:0; }
  .legitimate-button, .trash-button { border:0; border-radius:999px; padding:12px 16px; font:inherit; font-weight:800; cursor:pointer; }
  .legitimate-button { background:#048243; color:#fff; }
  .trash-button { border:2px solid #B3122D; background:#fff; color:#B3122D; }
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
    .spam-review-card { flex-direction:column; }
    .spam-review-actions { width:100%; }
    .spam-bulk-actions { justify-content:stretch; }
    .remove-all-spam-button { width:100%; }
    .status-area { flex-direction:column; align-items:stretch; }
    .status-workflow, .status-final { width:100%; margin-left:0; text-align:left; }
    .status-final h3 { text-align:left; }
    .status-picker-menu { left:0; right:0; width:100%; }
    .save-button { width:100%; }
  }

  .dashboard-title-block { min-width: 0; }
  .dashboard-title-block h1 { margin-bottom: 16px; }
  .find-project-control { display:flex; align-items:center; gap:0; width:fit-content; max-width:100%; margin:0 0 18px; }
  .find-project-toggle { display:inline-flex; align-items:center; justify-content:center; gap:9px; min-height:44px; padding:10px 16px; flex:0 0 auto; border:1.5px solid #78A987; border-radius:999px; background:#fff; color:#048243; font-family:inherit; font-size:.95rem; font-weight:800; line-height:1.1; cursor:pointer; transition:background .2s ease, color .2s ease, border-color .2s ease; }
  .find-project-toggle:hover, .find-project-control.is-open .find-project-toggle { background:#048243; color:#fff; border-color:#048243; }
  .find-project-toggle svg { width:19px; height:19px; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; flex:0 0 auto; }
  .find-project-expansion { display:grid; grid-template-columns:0fr; opacity:0; width:0; overflow:hidden; transition:grid-template-columns .28s ease, opacity .2s ease, width .28s ease; }
  .find-project-control.is-open .find-project-expansion { grid-template-columns:minmax(0,1fr); width:min(390px, calc(100vw - 210px)); opacity:1; margin-left:10px; }
  .find-project-expansion .project-search { min-width:0; height:44px; padding:10px 14px; border-radius:999px; }
  .urgent-toggle-row { display:flex; align-items:center; justify-content:space-between; gap:18px; margin-top:22px; padding:17px 19px; border:1px solid #D8E0D9; border-radius:16px; background:#F7F8F1; }
  .urgent-toggle-row h4 { margin:0 0 4px; color:#193024; font-size:1rem; }
  .urgent-toggle-row p { margin:0; color:#637166; font-size:.9rem; line-height:1.45; }
  .urgent-switch { position:relative; display:inline-flex; flex:0 0 auto; cursor:pointer; }
  .urgent-switch input { position:absolute; opacity:0; width:1px; height:1px; }
  .urgent-switch-track { display:flex; align-items:center; width:52px; height:30px; padding:3px; border-radius:999px; background:#CBD3CB; transition:background .2s ease; }
  .urgent-switch-track span { display:block; width:24px; height:24px; border-radius:50%; background:#fff; box-shadow:0 1px 4px rgba(0,0,0,.18); transition:transform .2s ease; }
  .urgent-switch input:checked + .urgent-switch-track { background:#B54B3B; }
  .urgent-switch input:checked + .urgent-switch-track span { transform:translateX(22px); }
  .urgent-switch input:focus-visible + .urgent-switch-track { outline:3px solid #78A987; outline-offset:3px; }
  .find-project-results { margin:-16px 0 30px; padding:16px; border:1px solid #D8E0D9; border-radius:18px; background:#FBFCF8; box-shadow:0 10px 28px rgba(25,48,36,.06); }
  .organizer-results { margin-top:0; }
  .leaf-confirm-backdrop { position:fixed; inset:0; z-index:10000; display:flex; align-items:center; justify-content:center; padding:22px; background:rgba(14,35,23,.58); backdrop-filter:blur(5px); }
  .leaf-confirm-modal { width:min(480px,100%); padding:32px; border:1px solid #C9D9CC; border-radius:26px; background:#F7F5EC; color:#193024; box-shadow:0 28px 90px rgba(8,31,17,.32); text-align:center; animation:leafConfirmIn .2s ease-out; }
  .leaf-confirm-mark { display:flex; align-items:center; justify-content:center; width:62px; height:62px; margin:0 auto 18px; border-radius:50%; background:#E2F0E4; }
  .leaf-confirm-mark svg { width:39px; height:39px; fill:#048243; stroke:#193024; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
  .leaf-confirm-modal .admin-eyebrow { margin-bottom:8px; }
  .leaf-confirm-modal h2 { margin:0 0 12px; color:#048243; font-family:"BPMF Huninn",sans-serif; font-size:clamp(1.6rem,4vw,2rem); }
  .leaf-confirm-modal p:not(.admin-eyebrow) { color:#4F6255; line-height:1.6; }
  .leaf-confirm-note { padding:12px 14px; border:1px solid #D7E3D7; border-radius:13px; background:#EEF4EA; font-size:.92rem; }
  .leaf-confirm-actions { display:flex; justify-content:center; flex-wrap:wrap; gap:10px; margin-top:22px; }
  .leaf-confirm-actions button { min-height:44px; padding:11px 17px; border-radius:999px; font:inherit; font-weight:800; cursor:pointer; }
  .leaf-confirm-secondary { border:1.5px solid #78A987; background:transparent; color:#17633B; }
  .leaf-confirm-primary { border:1.5px solid #048243; background:#048243; color:#fff; }
  .leaf-confirm-primary:hover { background:#036B37; border-color:#036B37; }
  @keyframes leafConfirmIn { from { opacity:0; transform:translateY(8px) scale(.98); } to { opacity:1; transform:translateY(0) scale(1); } }
  @media (max-width:700px) {
    .dashboard-title-block { width:100%; }
    .find-project-control { width:100%; }
    .find-project-control.is-open .find-project-expansion { width:100%; }
    .find-project-toggle { min-width:142px; }
    .leaf-confirm-modal { padding:26px 20px; }
    .urgent-toggle-row { align-items:flex-start; }
    .leaf-confirm-actions { flex-direction:column-reverse; }
    .leaf-confirm-actions button { width:100%; }
  }

`;
