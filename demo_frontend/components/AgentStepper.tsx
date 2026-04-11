import Link from "next/link";
import { AGENT_LABELS, AGENT_ORDER } from "@/lib/agents";
import { AgentKey } from "@/lib/types";

interface AgentStepperProps {
  current: AgentKey;
}

export function AgentStepper({ current }: AgentStepperProps) {
  return (
    <div className="agent-stepper">
      {AGENT_ORDER.map((agent) => {
        const isCurrent = agent === current;
        const isPast = AGENT_ORDER.indexOf(agent) < AGENT_ORDER.indexOf(current);

        return (
          <Link
            href={`/agents/${agent}`}
            key={agent}
            className={`step-chip ${isCurrent ? "current" : ""} ${isPast ? "past" : ""}`.trim()}
          >
            {AGENT_LABELS[agent]}
          </Link>
        );
      })}
    </div>
  );
}
