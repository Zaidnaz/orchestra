"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AgentStepper } from "@/components/AgentStepper";
import { CaseSummary } from "@/components/CaseSummary";
import { AGENT_LABELS, AGENT_ORDER, nextAgent } from "@/lib/agents";
import { loadCaseRecord } from "@/lib/storage";
import { AgentKey, CaseRecord } from "@/lib/types";

interface AgentPageProps {
  params: Promise<{ agent: string }>;
}

const isAgentKey = (value: string): value is AgentKey => AGENT_ORDER.includes(value as AgentKey);

const flowByAgent: Record<AgentKey, string[]> = {
  sentry: [
    "Ingest transaction and normalize signal features",
    "Run anomaly pattern scoring over amount and destination",
    "Produce initial risk recommendation"
  ],
  researcher: [
    "Collect account baseline and prior behavior windows",
    "Resolve entity linkage and beneficiary confidence",
    "Attach supporting context for policy decision"
  ],
  compliance: [
    "Map indicators to AML and KYC obligations",
    "Evaluate threshold and escalation policy",
    "Finalize action path with traceable rationale"
  ],
  scribe: [
    "Consolidate timeline from all upstream evidence",
    "Generate structured narrative for audit teams",
    "Deliver final case package to reporting stage"
  ]
};

export default function AgentPage({ params }: AgentPageProps) {
  const router = useRouter();
  const [record, setRecord] = useState<CaseRecord | null>(null);
  const [agent, setAgent] = useState<AgentKey | null>(null);

  useEffect(() => {
    let alive = true;

    const setup = async () => {
      const data = await params;
      if (!alive) {
        return;
      }

      if (!isAgentKey(data.agent)) {
        router.replace("/input");
        return;
      }

      const loaded = loadCaseRecord();
      if (!loaded) {
        router.replace("/input");
        return;
      }

      setAgent(data.agent);
      setRecord(loaded);
    };

    void setup();

    return () => {
      alive = false;
    };
  }, [params, router]);

  const nextRoute = useMemo(() => {
    if (!agent) {
      return null;
    }

    const next = nextAgent(agent);
    return next ? `/agents/${next}` : "/report";
  }, [agent]);

  if (!record || !agent || !nextRoute) {
    return <section className="panel loading-panel">Loading agent context...</section>;
  }

  const analysis = record.analyses[agent];

  return (
    <section className="agent-page reveal-up">
      <AgentStepper current={agent} />
      <CaseSummary record={record} />

      <article className="panel analysis-card">
        <p className="eyebrow">{AGENT_LABELS[agent]} Analysis</p>
        <h2>{analysis.summary}</h2>

        <div className="flow-status-row">
          <span className="flow-status-chip">Status: Completed</span>
          <span className="flow-status-meta">Agent {AGENT_ORDER.indexOf(agent) + 1} / {AGENT_ORDER.length}</span>
        </div>

        <div className="score-wrap">
          <p>Score</p>
          <strong>{analysis.score} / 100</strong>
        </div>

        <div className="mini-flow-box">
          <p className="mini-flow-title">How this agent worked</p>
          <ol>
            {flowByAgent[agent].map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <ul className="highlight-list">
          {analysis.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="recommendation-box">
          <p>Recommendation</p>
          <strong>{analysis.recommendation}</strong>
        </div>

        <div className="agent-actions">
          <Link href={nextRoute} className="btn btn-solid">
            {nextRoute === "/report" ? "Go To Final Report" : "Move To Next Agent"}
          </Link>
          <Link href="/input" className="btn btn-ghost">
            Edit Input
          </Link>
        </div>
      </article>
    </section>
  );
}
