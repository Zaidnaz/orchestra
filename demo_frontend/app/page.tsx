import Link from "next/link";
import Iridescence from "@/components/Iridescence";

const sampleFlow = [
  {
    stage: "Sentry Agent",
    detail: "Flags unusual velocity, geography, and channel anomalies"
  },
  {
    stage: "Researcher Agent",
    detail: "Builds contextual evidence from account and linkage patterns"
  },
  {
    stage: "Compliance Agent",
    detail: "Converts evidence into policy-aligned action decisions"
  },
  {
    stage: "Scribe Agent",
    detail: "Generates final report package for review and filing"
  },
  {
    stage: "Orchestrator Agent",
    detail: "Collects all agent outputs, validates the full trail, and closes the case workflow"
  }
];

export default function HomePage() {
  return (
    <section className="landing">
      <div className="hero-stack reveal-up">
        <div className="hero-iridescent-wrap panel">
          <Iridescence className="hero-iridescent" tint={[0.08, 0.56, 0.5]} speed={0.95} amplitude={0.09} />
          <div className="hero-overlay">
            <p className="eyebrow">Financial Crime Operating Interface</p>
            <h1>Investigations that move from signal to report without losing context.</h1>
            <p className="hero-copy">
              Launch a case, inspect each agent layer, and complete a regulator-ready report in one guided journey.
            </p>
            <div className="hero-actions">
              <Link href="/input" className="btn btn-solid">
                Start New Case
              </Link>
              <Link href="/agent-flow" className="btn btn-flow">
                New Horizon Hackathon
              </Link>
            </div>
          </div>
        </div>

        <article className="panel flow-preview">
          <div className="flow-head">
            <h2>Example Agent Flow</h2>
            <span>Reference walkthrough</span>
          </div>
          <div className="flow-list">
            {sampleFlow.map((item, index) => (
              <article key={item.stage} className="flow-item">
                <p className="flow-index">Step {index + 1}</p>
                <h3>{item.stage}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </article>

      </div>

      <div className="value-grid reveal-up delay-1">
        <article className="panel value-card">
          <h3>Structured Intake</h3>
          <p>Capture transaction context once and keep data consistent across every analysis stage.</p>
        </article>
        <article className="panel value-card">
          <h3>Transparent Decisions</h3>
          <p>Each agent outputs score, evidence highlights, and actionable recommendations.</p>
        </article>
        <article className="panel value-card">
          <h3>Audit-Ready Finish</h3>
          <p>Generate an end-to-end case report with chronology, compliance decision, and rationale.</p>
        </article>
      </div>
    </section>
  );
}
