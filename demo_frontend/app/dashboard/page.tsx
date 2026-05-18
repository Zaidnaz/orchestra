"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllDemoCases, DEMO_RISK_COLORS, DEMO_RISK_BG } from "@/lib/demo-cases";
import { loadHistory, clearHistory, saveCaseRecord } from "@/lib/storage";
import { CaseRecord } from "@/lib/types";
import { AGENT_ORDER } from "@/lib/agents";

const verdictColor: Record<string, string> = {
  BLOCK: "var(--danger)",
  REVIEW: "var(--warning)",
  ALLOW: "var(--brand)"
};

const verdictBg: Record<string, string> = {
  BLOCK: "var(--danger-light)",
  REVIEW: "var(--warning-light)",
  ALLOW: "var(--brand-light)"
};

const avgScore = (r: CaseRecord) => {
  const total = AGENT_ORDER.reduce((s, a) => s + r.analyses[a].score, 0);
  return Math.round(total / AGENT_ORDER.length);
};

export default function DashboardPage() {
  const router = useRouter();
  const [history, setHistory] = useState<CaseRecord[]>([]);
  const demoCases = getAllDemoCases();

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const loadDemo = (id: string) => {
    const dc = demoCases.find((d) => d.id === id);
    if (!dc) return;
    saveCaseRecord(dc.record);
    router.push("/agents/sentry");
  };

  const openCase = (record: CaseRecord) => {
    saveCaseRecord(record);
    router.push("/report");
  };

  const clearAll = () => {
    clearHistory();
    setHistory([]);
  };

  const blockCount = history.filter((r) => r.finalVerdict === "BLOCK").length;
  const reviewCount = history.filter((r) => r.finalVerdict === "REVIEW").length;
  const allowCount = history.filter((r) => r.finalVerdict === "ALLOW").length;

  return (
    <section className="dashboard-page reveal-up">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Investigation Console</p>
          <h1>Case Dashboard</h1>
          <p className="section-copy" style={{ marginTop: 0 }}>
            All investigations run in this session. Click any row to reload the full case.
          </p>
        </div>
        <Link href="/input" className="btn btn-solid">
          New Case →
        </Link>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="dash-stat">
          <div className="dash-stat-num">{history.length + demoCases.length}</div>
          <div className="dash-stat-label">Total Cases</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-num" style={{ color: "var(--danger)" }}>{blockCount}</div>
          <div className="dash-stat-label">Blocked</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-num" style={{ color: "var(--warning)" }}>{reviewCount}</div>
          <div className="dash-stat-label">Under Review</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-num" style={{ color: "var(--brand)" }}>{allowCount}</div>
          <div className="dash-stat-label">Cleared</div>
        </div>
      </div>

      {/* Demo cases */}
      <article className="panel">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: "0.25rem" }}>Pre-loaded Demo Cases</p>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--muted)" }}>
              Instant demo — no pipeline run needed. Load any case to explore the full investigation flow.
            </p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.7rem" }}>
          {demoCases.map((dc) => (
            <button
              key={dc.id}
              type="button"
              onClick={() => loadDemo(dc.id)}
              style={{
                textAlign: "left",
                padding: "0.9rem 1rem",
                border: `1.5px solid var(--line)`,
                borderRadius: "var(--radius-sm)",
                background: "var(--panel)",
                cursor: "pointer",
                transition: "all 150ms ease"
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = DEMO_RISK_COLORS[dc.riskLevel];
                (e.currentTarget as HTMLButtonElement).style.background = DEMO_RISK_BG[dc.riskLevel];
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--line)";
                (e.currentTarget as HTMLButtonElement).style.background = "var(--panel)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <span style={{
                  fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.05em",
                  padding: "0.15rem 0.45rem", borderRadius: "999px",
                  background: DEMO_RISK_BG[dc.riskLevel],
                  color: DEMO_RISK_COLORS[dc.riskLevel],
                  border: `1px solid ${DEMO_RISK_COLORS[dc.riskLevel]}33`
                }}>
                  {dc.riskLevel}
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>→ Load</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.2rem" }}>{dc.label}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.4 }}>{dc.description}</div>
            </button>
          ))}
        </div>
      </article>

      {/* Session history */}
      <article className="panel">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: "0.25rem" }}>Session History</p>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--muted)" }}>
              Cases run via the live pipeline in this browser session.
            </p>
          </div>
          {history.length > 0 && (
            <button className="btn btn-danger btn-sm" onClick={clearAll}>
              Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="empty-state">
            <h3>No live cases yet</h3>
            <p>Submit a transaction on the input page to run the real agent pipeline.</p>
            <Link href="/input" className="btn btn-solid btn-sm">
              Run Pipeline →
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="case-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Channel</th>
                  <th>Avg Score</th>
                  <th>Verdict</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((r) => (
                  <tr key={r.caseId} onClick={() => openCase(r)}>
                    <td className="case-id">{r.caseId.slice(0, 16)}</td>
                    <td style={{ fontWeight: 600 }}>{r.transaction.customerName}</td>
                    <td style={{ fontFamily: "var(--font-plex-mono), monospace", fontSize: "0.82rem" }}>
                      {r.transaction.currency} {r.transaction.amount.toLocaleString()}
                    </td>
                    <td>{r.transaction.channel}</td>
                    <td>
                      <span style={{
                        fontFamily: "var(--font-plex-mono), monospace",
                        fontWeight: 800,
                        color: avgScore(r) >= 70 ? "var(--danger)" : avgScore(r) >= 40 ? "var(--warning)" : "var(--brand)"
                      }}>
                        {avgScore(r)}/100
                      </span>
                    </td>
                    <td>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: "0.3rem",
                        padding: "0.2rem 0.55rem", borderRadius: "999px",
                        fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.05em",
                        background: verdictBg[r.finalVerdict],
                        color: verdictColor[r.finalVerdict]
                      }}>
                        {r.finalVerdict}
                      </span>
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                      {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}
