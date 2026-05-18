"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllDemoCases, DEMO_RISK_COLORS, DEMO_RISK_BG } from "@/lib/demo-cases";
import { saveCaseRecord } from "@/lib/storage";
import { CaseRecord } from "@/lib/types";

const currencies = ["USD", "EUR", "GBP", "INR"];
const channels = ["Card", "Wire", "Crypto Exchange", "Mobile Banking"];
const countries = ["Local", "Singapore", "UAE", "Hong Kong", "Nigeria", "Turkey"];

const PIPELINE_STAGES = [
  { key: "sentry", label: "Sentry Agent", role: "Anomaly Detection", estimatedEnd: 25 },
  { key: "researcher", label: "Researcher Agent", role: "Context Enrichment", estimatedEnd: 75 },
  { key: "compliance", label: "Compliance Agent", role: "Regulatory Decisioning", estimatedEnd: 110 },
  { key: "scribe", label: "Scribe Agent", role: "Report Generation", estimatedEnd: 155 },
  { key: "orchestrator", label: "Orchestrator", role: "Finalising Artifacts", estimatedEnd: 175 }
];

const getStageFromElapsed = (secs: number) => {
  for (let i = 0; i < PIPELINE_STAGES.length; i++) {
    if (secs < PIPELINE_STAGES[i].estimatedEnd) return i;
  }
  return PIPELINE_STAGES.length - 1;
};

export default function InputPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [jobStatus, setJobStatus] = useState<"idle" | "queued" | "running" | "succeeded" | "failed">("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeJobId, setActiveJobId] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [activeStage, setActiveStage] = useState(-1);
  const [doneStages, setDoneStages] = useState<number[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const demoCases = getAllDemoCases();

  const [form, setForm] = useState({
    customerName: "", accountId: "", amount: "", currency: "USD",
    destinationCountry: "Local", channel: "Wire", narrative: "", geminiApiKey: ""
  });

  const f = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startTimer = (startedAt: number) => {
    timerRef.current = setInterval(() => {
      const secs = Math.floor((Date.now() - startedAt) / 1000);
      setElapsedSeconds(secs);
      const stageIdx = getStageFromElapsed(secs);
      setActiveStage(stageIdx);
      const done: number[] = [];
      for (let i = 0; i < stageIdx; i++) done.push(i);
      setDoneStages(done);
    }, 500);
  };

  const stopTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const loadDemoCase = (id: string) => {
    const dc = demoCases.find((d) => d.id === id);
    if (!dc) return;
    saveCaseRecord(dc.record);
    router.push("/agents/sentry");
  };

  const applyProfile = (index: number) => {
    const dc = demoCases[index];
    setSelectedProfile(index);
    setForm((p) => ({
      ...p,
      customerName: dc.record.transaction.customerName,
      accountId: dc.record.transaction.accountId,
      amount: String(dc.record.transaction.amount),
      currency: dc.record.transaction.currency,
      destinationCountry: dc.record.transaction.destinationCountry,
      channel: dc.record.transaction.channel,
      narrative: dc.record.transaction.narrative
    }));
    setError("");
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const amount = Number(form.amount);
    if (!form.customerName || !form.accountId || !form.narrative || Number.isNaN(amount) || amount <= 0) {
      setError("Please fill all required fields with a valid positive amount.");
      return;
    }

    setIsRunning(true);
    setJobStatus("queued");
    setElapsedSeconds(0);
    setActiveStage(0);
    setDoneStages([]);
    setActiveJobId("");
    const startedAt = Date.now();
    startTimer(startedAt);

    try {
      const res = await fetch("/api/cases/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName, accountId: form.accountId,
          amount, currency: form.currency, destinationCountry: form.destinationCountry,
          channel: form.channel, narrative: form.narrative,
          geminiApiKey: form.geminiApiKey.trim() || undefined
        })
      });

      const data = (await res.json()) as { jobId?: string; error?: string };
      if (!res.ok || !data.jobId) throw new Error(data.error ?? "Pipeline run failed.");

      setJobStatus("running");
      setActiveJobId(data.jobId);

      let resolvedRecord: CaseRecord | null = null;
      for (let i = 0; i < 180; i++) {
        const jr = await fetch(`/api/cases/jobs/${data.jobId}`, { cache: "no-store" });
        const jd = (await jr.json()) as { status?: string; caseRecord?: CaseRecord; error?: string };

        if (jd.status === "succeeded" && jd.caseRecord) {
          setJobStatus("succeeded");
          setDoneStages([0, 1, 2, 3, 4]);
          setActiveStage(-1);
          resolvedRecord = jd.caseRecord;
          break;
        }
        if (jd.status === "failed") throw new Error(jd.error ?? "Agent execution failed.");
        await new Promise((r) => setTimeout(r, 1000));
      }

      if (!resolvedRecord) throw new Error("Pipeline timed out. Please retry.");
      stopTimer();
      saveCaseRecord(resolvedRecord);
      router.push("/agents/sentry");
    } catch (err) {
      stopTimer();
      setJobStatus("failed");
      setActiveStage(-1);
      setError(err instanceof Error ? err.message : "Pipeline execution failed.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <section className="panel input-wrap reveal-up">
      <div className="input-head">
        <div>
          <p className="eyebrow" style={{ marginBottom: "0.4rem" }}>New Investigation</p>
          <h1>Create Case</h1>
          <p className="section-copy" style={{ marginTop: 0 }}>
            Fill in a transaction or pick a pre-loaded demo to instantly explore the full investigation flow.
          </p>
        </div>
      </div>

      {/* Demo cases — instant load */}
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: "0.5rem", marginTop: "0" }}>
          Instant Demo — load pre-computed result
        </p>
        <div className="demo-profiles">
          {demoCases.map((dc, index) => (
            <div key={dc.id} style={{ display: "grid", gap: "0.3rem" }}>
              <button
                type="button"
                className={`demo-profile-card${selectedProfile === index ? " selected" : ""}`}
                onClick={() => applyProfile(index)}
                disabled={isRunning}
              >
                <div className="demo-profile-name">{dc.record.transaction.customerName}</div>
                <div className="demo-profile-detail">{dc.record.transaction.accountId} · {dc.record.transaction.channel}</div>
                <div className="demo-profile-amount">
                  {dc.record.transaction.currency} {dc.record.transaction.amount.toLocaleString()}
                </div>
                <div style={{
                  marginTop: "0.4rem", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.04em",
                  color: DEMO_RISK_COLORS[dc.riskLevel], background: DEMO_RISK_BG[dc.riskLevel],
                  display: "inline-block", padding: "0.15rem 0.45rem", borderRadius: "999px"
                }}>
                  {dc.riskLevel}
                </div>
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => loadDemoCase(dc.id)}
                disabled={isRunning}
                style={{ fontSize: "0.72rem" }}
              >
                ⚡ Load instantly
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline progress — shown while running */}
      {jobStatus !== "idle" && (
        <div className="panel-flat pipeline-progress" style={{ marginBottom: "1rem", padding: "1.1rem 1.25rem" }}>
          <div className="pipeline-progress-header">
            <span className="pipeline-progress-title">
              {jobStatus === "succeeded" ? "✓ Pipeline Complete" : jobStatus === "failed" ? "✗ Pipeline Failed" : "Running Pipeline"}
            </span>
            <span className="pipeline-progress-time">{elapsedSeconds}s elapsed</span>
          </div>
          {PIPELINE_STAGES.map((stage, i) => {
            const isDone = doneStages.includes(i) || jobStatus === "succeeded";
            const isActive = activeStage === i && jobStatus !== "succeeded" && jobStatus !== "failed";
            return (
              <div
                key={stage.key}
                className={`pipeline-stage${isDone ? " stage-done" : isActive ? " stage-active" : ""}`}
              >
                <div className="pipeline-stage-dot">
                  {isDone ? "✓" : isActive ? "●" : i + 1}
                </div>
                <div className="pipeline-stage-content">
                  <div className="pipeline-stage-name">{stage.label}</div>
                  <div className="pipeline-stage-status">
                    {isDone ? `Completed` : isActive ? `Running — ${stage.role}` : `Waiting`}
                  </div>
                </div>
              </div>
            );
          })}
          {activeJobId && (
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-plex-mono), monospace" }}>
              Job: {activeJobId.slice(0, 12)}…
            </p>
          )}
        </div>
      )}

      {/* Form */}
      <div style={{ borderTop: "1px solid var(--line-light)", paddingTop: "1rem" }}>
        <p style={{ margin: "0 0 1rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)" }}>
          Or run the live pipeline
        </p>
        <form onSubmit={onSubmit} className="form-grid">
          <div className="form-section-label">Transaction Details</div>

          <label>Customer Name
            <input value={form.customerName} onChange={f("customerName")} placeholder="Aarav Mehta" disabled={isRunning} />
          </label>
          <label>Account ID
            <input value={form.accountId} onChange={f("accountId")} placeholder="ACC-900182" disabled={isRunning} />
          </label>
          <label>Amount
            <input type="number" min="0" step="0.01" value={form.amount} onChange={f("amount")} placeholder="42000" disabled={isRunning} />
          </label>
          <label>Currency
            <select value={form.currency} onChange={f("currency")} disabled={isRunning}>
              {currencies.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label>Destination Country
            <select value={form.destinationCountry} onChange={f("destinationCountry")} disabled={isRunning}>
              {countries.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label>Channel
            <select value={form.channel} onChange={f("channel")} disabled={isRunning}>
              {channels.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="narrative-field">Transaction Narrative
            <textarea rows={3} value={form.narrative} onChange={f("narrative")}
              placeholder="Describe the transaction purpose, beneficiary relationship, urgency indicators..."
              disabled={isRunning} />
          </label>

          <div className="form-section-label">Optional</div>
          <label className="narrative-field">
            Gemini API Key <span style={{ fontWeight: 400, color: "var(--muted)" }}>(optional — enables cloud LLM for Scribe)</span>
            <input type="password" value={form.geminiApiKey} onChange={f("geminiApiKey")}
              placeholder="Paste key to use Gemini instead of local Ollama"
              autoComplete="off" disabled={isRunning} />
          </label>

          {error && <p className="error-text">{error}</p>}

          <div style={{ gridColumn: "1 / -1", display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button type="submit" className="btn btn-solid" disabled={isRunning} style={{ minWidth: "200px" }}>
              {isRunning ? "Running Pipeline…" : "Run Agent Pipeline →"}
            </button>
            {!isRunning && (
              <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--muted)" }}>
                Takes 30–180s depending on LLM
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
