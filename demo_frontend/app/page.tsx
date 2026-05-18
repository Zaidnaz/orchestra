import Link from "next/link";
import Iridescence from "@/components/Iridescence";

const agentFlow = [
  { stage: "Sentry", role: "Anomaly Detection", detail: "11 AML rule codes + ML scoring + vector pattern match. Emits risk band.", step: "01", color: "#0b6655" },
  { stage: "Researcher", role: "Context Enrichment", detail: "Account history, device graph, IP intel, entity linkages, impossible-travel.", step: "02", color: "#1a4ed8" },
  { stage: "Compliance", role: "Regulatory Decisioning", detail: "PMLA / RBI KYC / I4C mapping. Weighted signal framework. Clause citations.", step: "03", color: "#7a4500" },
  { stage: "Scribe", role: "SAR Narrative", detail: "LLM-generated report with chronological timeline and regulatory references.", step: "04", color: "#6b21a8" },
  { stage: "Orchestrator", role: "Pipeline Coordinator", detail: "Evidence chain validation, artifact archiving, pipeline summary.", step: "05", color: "#374151" }
];

const stats = [
  { num: "4", label: "Autonomous agents in one pipeline" },
  { num: "11", label: "AML reason codes per transaction" },
  { num: "< 3m", label: "Signal → filed SAR" }
];

const withoutAI = [
  { label: "Time to close", value: "3–5 days" },
  { label: "Analysts required", value: "6–8 FTE" },
  { label: "Consistency", value: "Variable" },
  { label: "Audit trail", value: "Manual" }
];

const withAI = [
  { label: "Time to close", value: "< 3 min" },
  { label: "Analysts required", value: "0 (supervised)" },
  { label: "Consistency", value: "100% deterministic" },
  { label: "Audit trail", value: "Full citation" }
];

const valuePillars = [
  { icon: "⚡", title: "Structured Intake", body: "Capture transaction context once. Every downstream agent works from the same validated signal — no data drift between stages." },
  { icon: "🔍", title: "Transparent Decisions", body: "Each agent exposes score, evidence highlights, and regulatory citation. Full traceability from signal to verdict." },
  { icon: "📋", title: "Audit-Ready Output", body: "Complete SAR — chronology, compliance rationale, regulatory references. Ready for FIU-India filing." }
];

export default function HomePage() {
  return (
    <section className="landing">
      <div className="hero-stack reveal-up">
        {/* Hero */}
        <div className="hero-iridescent-wrap panel">
          <Iridescence className="hero-iridescent" tint={[0.05, 0.52, 0.45]} speed={0.85} amplitude={0.08} />
          <div className="hero-overlay">
            <p className="eyebrow">Financial Crime Operating Interface · Hackathon Demo</p>
            <h1 className="hero-card">
              Signal to SAR — without losing the thread.
            </h1>
            <p className="hero-copy" style={{ maxWidth: "56ch" }}>
              Four autonomous AI agents take a flagged transaction from anomaly detection through
              regulatory decisioning to a filed Suspicious Activity Report — in under 3 minutes.
            </p>
            <div className="hero-actions">
              <Link href="/dashboard" className="btn btn-solid">
                Open Dashboard →
              </Link>
              <Link href="/input" className="btn btn-flow">
                Run Live Pipeline
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row reveal-up delay-1">
          {stats.map((s) => (
            <article key={s.num} className="stat-card">
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </article>
          ))}
        </div>

        {/* Pipeline */}
        <article className="panel flow-preview reveal-up delay-2">
          <div className="flow-head">
            <h2>Investigation Pipeline</h2>
            <span>Autonomous · End-to-end</span>
          </div>
          <div className="flow-list">
            {agentFlow.map((item) => (
              <article key={item.stage} className="flow-item">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: item.color, color: "white",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.65rem", fontWeight: 800, flexShrink: 0
                  }}>{item.step}</span>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: item.color }}>
                    {item.role}
                  </span>
                </div>
                <h3>{item.stage}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </article>

        {/* Without AI vs With AI comparison */}
        <article className="panel comparison-panel reveal-up delay-2">
          <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>Why Automation Matters</p>
          <div className="comparison-grid">
            {/* Manual */}
            <div className="comparison-side">
              <h3 style={{ color: "var(--danger)" }}>❌ Manual Investigation</h3>
              {withoutAI.map((row) => (
                <div key={row.label} className="comparison-row bad">
                  <span className="comparison-label">{row.label}</span>
                  <span className="comparison-value">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="comparison-vs">VS</div>

            {/* Automated */}
            <div className="comparison-side">
              <h3 style={{ color: "var(--brand)" }}>✅ New Horizon</h3>
              {withAI.map((row) => (
                <div key={row.label} className="comparison-row good">
                  <span className="comparison-label">{row.label}</span>
                  <span className="comparison-value">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>

      {/* Value pillars */}
      <div className="value-grid reveal-up delay-3">
        {valuePillars.map((p) => (
          <article key={p.title} className="panel value-card">
            <div className="value-icon">{p.icon}</div>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
