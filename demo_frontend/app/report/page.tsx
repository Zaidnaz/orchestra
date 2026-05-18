"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CaseSummary } from "@/components/CaseSummary";
import { ScoreRing } from "@/components/ScoreRing";
import { AGENT_LABELS, AGENT_ORDER } from "@/lib/agents";
import { downloadReportJson, downloadReportMarkdown, downloadReportPdf } from "@/lib/report";
import { clearCaseRecord, loadCaseRecord } from "@/lib/storage";
import { CaseRecord } from "@/lib/types";

const verdictMeta = {
  BLOCK: {
    cls: "verdict-BLOCK",
    headline: "Transaction Blocked",
    detail: "High-risk indicators require immediate action. Filing of Suspicious Activity Report recommended."
  },
  REVIEW: {
    cls: "verdict-REVIEW",
    headline: "Under Review — EDD Required",
    detail: "Elevated signals detected. Enhanced due diligence required before proceeding."
  },
  ALLOW: {
    cls: "verdict-ALLOW",
    headline: "Transaction Cleared",
    detail: "Risk signals are within acceptable thresholds. No immediate action required."
  }
};

const agentRoleMap: Record<string, string> = {
  sentry: "Anomaly Detection",
  researcher: "Context Enrichment",
  compliance: "Regulatory Decisioning",
  scribe: "Report Generation"
};

/* ── Lightweight markdown → JSX renderer (no deps) ── */
function renderMarkdown(md: string): React.ReactNode[] {
  const lines = md.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  const inlineFormat = (text: string, key: number): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
    return (
      <span key={key}>
        {parts.map((p, j) => {
          if (p.startsWith("**") && p.endsWith("**")) return <strong key={j}>{p.slice(2, -2)}</strong>;
          if (p.startsWith("*") && p.endsWith("*")) return <em key={j}>{p.slice(1, -1)}</em>;
          if (p.startsWith("`") && p.endsWith("`")) return <code key={j}>{p.slice(1, -1)}</code>;
          return p;
        })}
      </span>
    );
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("# ")) {
      nodes.push(<h1 key={i}>{line.slice(2)}</h1>);
    } else if (line.startsWith("## ")) {
      nodes.push(<h2 key={i}>{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      nodes.push(<h3 key={i}>{line.slice(4)}</h3>);
    } else if (line.startsWith("> ")) {
      nodes.push(<blockquote key={i}>{inlineFormat(line.slice(2), i)}</blockquote>);
    } else if (line.startsWith("---")) {
      nodes.push(<hr key={i} style={{ border: "none", borderTop: "1px solid var(--line)", margin: "1rem 0" }} />);
    } else if (line.match(/^\|.+\|$/)) {
      // collect table rows
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].match(/^\|.+\|$/)) {
        if (!lines[i].match(/^\|[\s-|]+\|$/)) tableLines.push(lines[i]);
        i++;
      }
      if (tableLines.length > 0) {
        const headers = tableLines[0].split("|").filter(Boolean).map((c) => c.trim());
        const rows = tableLines.slice(1);
        nodes.push(
          <div key={`table-${i}`} style={{ overflowX: "auto", margin: "0.75rem 0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr>
                  {headers.map((h, j) => (
                    <th key={j} style={{ textAlign: "left", padding: "0.4rem 0.65rem", borderBottom: "2px solid var(--line)", color: "var(--ink)", fontWeight: 700, background: "var(--brand-light)", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.split("|").filter(Boolean).map((cell, ci) => (
                      <td key={ci} style={{ padding: "0.4rem 0.65rem", borderBottom: "1px solid var(--line-light)", verticalAlign: "top" }}>
                        {inlineFormat(cell.trim(), ci)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    } else if (line.match(/^[-*] /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        items.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`}>
          {items.map((item, j) => <li key={j}>{inlineFormat(item, j)}</li>)}
        </ul>
      );
      continue;
    } else if (line.match(/^\d+\. /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`}>
          {items.map((item, j) => <li key={j}>{inlineFormat(item, j)}</li>)}
        </ol>
      );
      continue;
    } else if (line.trim() !== "") {
      nodes.push(<p key={i}>{inlineFormat(line, i)}</p>);
    }

    i++;
  }

  return nodes;
}

export default function ReportPage() {
  const router = useRouter();
  const [record, setRecord] = useState<CaseRecord | null>(null);
  const [sarOpen, setSarOpen] = useState(false);

  useEffect(() => {
    const loaded = loadCaseRecord();
    if (!loaded) { router.replace("/input"); return; }
    setRecord(loaded);
  }, [router]);

  const averageScore = useMemo(() => {
    if (!record) return 0;
    const total = AGENT_ORDER.reduce((sum, a) => sum + record.analyses[a].score, 0);
    return Math.round(total / AGENT_ORDER.length);
  }, [record]);

  if (!record) {
    return (
      <section className="panel loading-panel reveal-up">
        <p style={{ margin: 0, fontWeight: 600 }}>Loading final report…</p>
        <div className="loading-dots"><span /><span /><span /></div>
      </section>
    );
  }

  const vm = verdictMeta[record.finalVerdict] ?? verdictMeta.REVIEW;
  const closedAt = new Date(record.createdAt).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  });

  return (
    <section className="report-page reveal-up">
      <CaseSummary record={record} />

      {/* Verdict hero */}
      <article className="panel report-hero">
        <div className="report-hero-content">
          <p className="eyebrow">Investigation Complete</p>
          <h1>{vm.headline}</h1>
          <p className="section-copy">{vm.detail}</p>
          <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: "0.5rem", marginBottom: 0 }}>
            Closed {closedAt} · Compliance: <strong style={{ color: "var(--ink)" }}>{record.analyses.compliance.recommendation}</strong>
          </p>
        </div>
        <div className="report-hero-badge" style={{ textAlign: "center", flexShrink: 0 }}>
          <span className={`verdict-badge verdict-badge-lg ${vm.cls}`} style={{ display: "inline-flex", marginBottom: "0.9rem" }}>
            {record.finalVerdict}
          </span>
          <ScoreRing score={averageScore} size={88} />
          <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.5rem", marginBottom: 0, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
            Avg. Confidence
          </p>
        </div>
      </article>

      {/* Agent summaries */}
      <section className="report-grid">
        {AGENT_ORDER.map((agent) => {
          const a = record.analyses[agent];
          const rc = a.score >= 70 ? "high" : a.score >= 40 ? "medium" : "low";
          const color = rc === "high" ? "var(--danger)" : rc === "medium" ? "var(--warning)" : "var(--brand)";
          return (
            <article key={agent} className="panel report-card">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
                <div>
                  <p style={{ margin: "0 0 0.1rem", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted)" }}>
                    {agentRoleMap[agent]}
                  </p>
                  <h3>{AGENT_LABELS[agent]}</h3>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div className="report-card-score" style={{ color }}>{a.score}</div>
                  <div className="report-card-score-label">/ 100</div>
                </div>
              </div>
              <p>{a.summary}</p>
              <div className="risk-meter" style={{ marginTop: "0.4rem" }}>
                <div className="risk-meter-bar">
                  <div className={`risk-meter-fill ${rc}`} style={{ width: `${a.score}%` }} />
                </div>
              </div>
              <ul className="report-card-highlights">
                {a.highlights.slice(0, 3).map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          );
        })}
      </section>

      {/* SAR Report inline viewer */}
      {record.sarReport && (
        <div className="sar-report-panel">
          <button
            type="button"
            className="sar-report-toggle"
            onClick={() => setSarOpen((v) => !v)}
          >
            <div className="sar-report-toggle-label">
              <span style={{ fontSize: "1.1rem" }}>📋</span>
              <div>
                <div className="sar-report-toggle-title">View SAR / Investigation Report</div>
                <div className="sar-report-toggle-meta">Full narrative generated by Scribe agent · click to expand</div>
              </div>
            </div>
            <span className={`sar-report-toggle-icon${sarOpen ? " open" : ""}`}>▾</span>
          </button>
          {sarOpen && (
            <div className="sar-report-body">
              {renderMarkdown(record.sarReport)}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <article className="panel report-actions-panel">
        <div className="report-actions-left">
          <h3>Next Action</h3>
          <p>{record.analyses.compliance.recommendation}</p>
        </div>
        <div className="report-buttons">
          <button className="btn btn-solid" onClick={() => downloadReportPdf(record)}>↓ PDF</button>
          <button className="btn btn-ghost" onClick={() => downloadReportMarkdown(record)}>↓ Markdown</button>
          <button className="btn btn-ghost" onClick={() => downloadReportJson(record)}>↓ JSON</button>
          <Link href="/input" className="btn btn-solid">New Case</Link>
          <button className="btn btn-danger" onClick={() => { clearCaseRecord(); router.push("/"); }}>
            Clear Session
          </button>
        </div>
      </article>
    </section>
  );
}
