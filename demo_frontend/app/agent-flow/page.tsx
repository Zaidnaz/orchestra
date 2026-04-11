import Link from "next/link";

const agentFlow = [
  {
    name: "Sentry Agent",
    role: "Anomaly detection",
    summary: "Creates first-pass risk signal based on amount, channel, destination, and behavior deviations."
  },
  {
    name: "Researcher Agent",
    role: "Context enrichment",
    summary: "Adds account history, relationship context, and narrative clues to strengthen or reduce suspicion."
  },
  {
    name: "Compliance Agent",
    role: "Policy decisioning",
    summary: "Maps evidence against AML/KYC controls and produces action recommendation with rationale."
  },
  {
    name: "Scribe Agent",
    role: "Report generation",
    summary: "Converts all prior agent findings into a regulator-readable final report and structured record."
  },
  {
    name: "Orchestrator Agent",
    role: "Pipeline conductor",
    summary: "Runs as the closing coordinator by validating outputs, sequencing handoffs, and finalizing the complete case package."
  }
];

export default function AgentFlowPage() {
  return (
    <section className="agent-flow-page reveal-up">
      <article className="panel flow-intro">
        <p className="eyebrow">Example Multi-Agent Orchestration</p>
        <h1>How the agent pipeline works end-to-end</h1>
        <p className="section-copy">
          This page shows the conceptual flow used by the orchestrator. It is an explainer route, so it works even without
          creating a case first.
        </p>
        <div className="hero-actions">
          <Link href="/input" className="btn btn-solid">
            Start With Input
          </Link>
          <Link href="/agents/sentry" className="btn btn-ghost">
            Run Agent Screens
          </Link>
        </div>
      </article>

      <section className="flow-lane">
        {agentFlow.map((item, index) => (
          <article key={item.name} className="panel flow-lane-card">
            <p className="flow-index">Step {index + 1}</p>
            <h3>{item.name}</h3>
            <p className="flow-role">{item.role}</p>
            <p>{item.summary}</p>
          </article>
        ))}
      </section>

      <article className="panel flow-notes">
        <h3>Demo Notes</h3>
        <p>
          Inputs on the case form are the minimum set for this UI demo. Production-grade workflows usually add customer risk tier,
          device ID, IP, geo confidence, sanctions/PEP checks, and transaction history windows.
        </p>
      </article>
    </section>
  );
}
