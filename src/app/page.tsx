"use client";

import { Activity, BarChart3, CalendarCheck, Check, ChevronDown, CirclePause, Clock3, FileUp, Headphones, LayoutDashboard, ListFilter, Mic2, MoreHorizontal, Phone, PhoneCall, PhoneOff, Play, Plus, Search, Settings, ShieldCheck, Sparkles, Upload, Users, X } from "lucide-react";
import { ChangeEvent, useMemo, useState } from "react";

type Lead = { name: string; company: string; phone: string; source: string; consent: boolean; status: "Qualified" | "Follow-up" | "Not interested" | "Calling" | "Queued"; score: number; lastCall: string };
const initialLeads: Lead[] = [
  { name: "Rohan Mehta", company: "Northstar Dental", phone: "+91 98••• 2410", source: "Website form", consent: true, status: "Qualified", score: 92, lastCall: "2 min ago" },
  { name: "Ananya Shah", company: "Canvas & Co.", phone: "+91 99••• 8732", source: "Demo request", consent: true, status: "Follow-up", score: 78, lastCall: "8 min ago" },
  { name: "Vikram Saini", company: "Peakline Fitness", phone: "+91 97••• 4108", source: "Referral", consent: true, status: "Not interested", score: 26, lastCall: "17 min ago" },
  { name: "Priya Nair", company: "GreenFork Foods", phone: "+91 96••• 3351", source: "Website form", consent: true, status: "Calling", score: 64, lastCall: "Live now" },
  { name: "Arjun Bedi", company: "Bedi Legal", phone: "+91 88••• 1019", source: "Automation audit", consent: true, status: "Queued", score: 0, lastCall: "—" },
];
const nav = [[LayoutDashboard, "Overview"], [PhoneCall, "Campaigns"], [Users, "Leads"], [Headphones, "Call history"], [BarChart3, "Analytics"]] as const;
const statusStyle: Record<Lead["status"], string> = { Qualified: "status qualified", "Follow-up": "status followup", "Not interested": "status muted", Calling: "status calling", Queued: "status queued" };

function Waveform() { return <div className="waveform" aria-hidden="true">{[18,30,14,42,28,50,34,58,24,44,19,36,28,52,31,46,20,38,25,32].map((height, index) => <span key={index} style={{ height }} />)}</div> }

export default function Home() {
  const [leads, setLeads] = useState(initialLeads);
  const [campaignActive, setCampaignActive] = useState(true);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const filteredLeads = useMemo(() => leads.filter((lead) => `${lead.name} ${lead.company} ${lead.status}`.toLowerCase().includes(search.toLowerCase())), [leads, search]);

  function importLeads(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const rows = String(reader.result).split(/\r?\n/).slice(1).filter(Boolean);
      const imported = rows.slice(0, 1000).map((row, index): Lead => {
        const [name = `Lead ${index + 1}`, company = "Unknown business", phone = "", source = "CSV upload", consent = ""] = row.split(",").map((cell) => cell.trim());
        return { name, company, phone, source, consent: /true|yes|1|opt-in/i.test(consent), status: "Queued", score: 0, lastCall: "—" };
      }).filter((lead) => lead.phone && lead.consent);
      setLeads((current) => [...imported, ...current]);
      setNotice(`${imported.length} consent-verified leads imported. Non-consented rows were skipped.`);
      window.setTimeout(() => setNotice(""), 5000);
    };
    reader.readAsText(file); event.target.value = "";
  }

  function toggleCampaign() {
    if (!campaignActive && !leads.some((lead) => lead.consent && lead.status === "Queued")) { setNotice("Add at least one consent-verified queued lead before starting."); return; }
    if (!campaignActive) setNotice("Campaign is ready. Connect Vapi credentials to place real calls.");
    setCampaignActive((value) => !value);
  }

  return <main className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><Mic2 size={18} /></span><span>Dialora</span></div>
      <nav aria-label="Main navigation">{nav.map(([Icon, label], index) => <button className={index === 0 ? "nav-item active" : "nav-item"} key={label}><Icon size={18} /><span>{label}</span>{label === "Campaigns" && <span className="nav-count">1</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="compliance-card"><ShieldCheck size={19} /><div><strong>Consent guard active</strong><p>Only verified opt-in leads can be called.</p></div></div><button className="nav-item"><Settings size={18} /><span>Settings</span></button><div className="profile"><span>AC</span><div><strong>Aditya</strong><p>Workspace owner</p></div><MoreHorizontal size={17} /></div></div>
    </aside>
    <section className="workspace">
      <header className="topbar"><div><p className="eyebrow">SALES COMMAND CENTER</p><h1>Good evening, Aditya</h1></div><div className="top-actions"><button className="icon-button" aria-label="Activity"><Activity size={19} /></button><label className="button secondary upload-button"><Upload size={17} /> Import leads<input type="file" accept=".csv,text/csv" onChange={importLeads} /></label><button className="button primary"><Plus size={17} /> New campaign</button></div></header>
      {notice && <div className="notice"><Check size={16} />{notice}<button onClick={() => setNotice("")} aria-label="Dismiss"><X size={15} /></button></div>}
      <div className="metrics-grid">
        <article className="metric"><div><p>Calls today</p><strong>128</strong></div><span className="metric-icon lilac"><Phone size={19} /></span><small><b>+18%</b> from yesterday</small></article>
        <article className="metric"><div><p>Connected</p><strong>71</strong></div><span className="metric-icon mint"><PhoneCall size={19} /></span><small><b>55.5%</b> connect rate</small></article>
        <article className="metric"><div><p>Qualified</p><strong>24</strong></div><span className="metric-icon amber"><Sparkles size={19} /></span><small><b>33.8%</b> of connected</small></article>
        <article className="metric"><div><p>Meetings booked</p><strong>11</strong></div><span className="metric-icon blue"><CalendarCheck size={19} /></span><small><b>45.8%</b> of qualified</small></article>
      </div>
      <div className="content-grid">
        <section className="panel live-panel"><div className="panel-heading"><div><span className="live-dot" /> Live call</div><span>01:47</span></div><div className="call-person"><div className="avatar">PN</div><div><h2>Priya Nair</h2><p>GreenFork Foods · Bengaluru</p></div><span className="language">HI + EN</span></div><div className="agent-speaking"><div><span className="ai-orb"><Mic2 size={18} /></span><div><strong>Maya is speaking</strong><p>AI sales agent</p></div></div><Waveform /></div><div className="transcript"><p className="transcript-label">LIVE TRANSCRIPT</p><p><span>Maya</span> “Aapke restaurant ke repeat orders ko automate karne ke liye hum WhatsApp ordering aur loyalty workflow set up kar sakte hain.”</p><p><span>Priya</span> “Haan, abhi hum manually messages handle karte hain. Demo kab ho sakta hai?”</p></div><div className="signal-row"><span><Check size={14} /> Need identified</span><span><Check size={14} /> Decision maker</span><span><Clock3 size={14} /> Timeline pending</span></div><div className="call-controls"><button className="round-control" aria-label="Mute"><Mic2 size={18} /></button><button className="round-control" aria-label="Pause"><CirclePause size={18} /></button><button className="round-control danger" aria-label="End call"><PhoneOff size={18} /></button></div></section>
        <section className="panel campaign-panel"><div className="panel-heading"><div>Active campaign</div><button aria-label="Campaign options"><MoreHorizontal size={19} /></button></div><div className="campaign-title"><div><span className="campaign-icon"><PhoneCall size={20} /></span><div><h2>Website & automation outreach</h2><p>Hindi + English · Maya</p></div></div><span className={campaignActive ? "campaign-state" : "campaign-state paused"}>{campaignActive ? "RUNNING" : "PAUSED"}</span></div><div className="progress-label"><span>Daily progress</span><strong>128 / 200</strong></div><div className="progress"><span style={{ width: "64%" }} /></div><div className="campaign-stats"><div><strong>42</strong><span>Remaining</span></div><div><strong>4</strong><span>In queue</span></div><div><strong>2</strong><span>Concurrent</span></div></div><div className="schedule"><Clock3 size={17} /><div><strong>Calling window</strong><p>10:00 AM – 6:30 PM IST · Mon–Sat</p></div></div><button className="button campaign-action" onClick={toggleCampaign}>{campaignActive ? <><CirclePause size={17} /> Pause campaign</> : <><Play size={17} /> Resume campaign</>}</button></section>
      </div>
      <section className="panel leads-panel"><div className="leads-header"><div><h2>Recent leads</h2><p>AI-qualified outcomes from your latest calls</p></div><div className="table-actions"><label className="search"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads" /></label><button className="filter-button"><ListFilter size={16} /> Filter <ChevronDown size={14} /></button></div></div><div className="table-wrap"><table><thead><tr><th>Lead</th><th>Source</th><th>Status</th><th>AI score</th><th>Last call</th><th aria-label="Actions" /></tr></thead><tbody>{filteredLeads.map((lead) => <tr key={`${lead.name}-${lead.company}`}><td><div className="lead-name"><span>{lead.name.split(" ").map((part) => part[0]).join("")}</span><div><strong>{lead.name}</strong><p>{lead.company} · {lead.phone}</p></div></div></td><td>{lead.source}</td><td><span className={statusStyle[lead.status]}>{lead.status === "Calling" && <i />} {lead.status}</span></td><td><div className="score"><span><i style={{ width: `${lead.score}%` }} /></span><b>{lead.score || "—"}</b></div></td><td>{lead.lastCall}</td><td><button className="row-menu" aria-label={`Actions for ${lead.name}`}><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table>{!filteredLeads.length && <div className="empty-state"><FileUp size={24} /><strong>No leads found</strong><p>Try a different search or import a consent-verified CSV.</p></div>}</div></section>
    </section>
  </main>;
}
