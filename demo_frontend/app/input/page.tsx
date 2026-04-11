"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { saveCaseRecord } from "@/lib/storage";
import { CaseRecord } from "@/lib/types";

const currencies = ["USD", "EUR", "GBP", "INR"];
const channels = ["Card", "Wire", "Crypto Exchange", "Mobile Banking"];
const countries = ["Local", "Singapore", "UAE", "Hong Kong", "Nigeria", "Turkey"];

const demoProfiles = [
  {
    customerName: "Aarav Mehta",
    accountId: "ACC-NH-204",
    amount: "920000",
    currency: "USD",
    destinationCountry: "UAE",
    channel: "Mobile Banking",
    narrative: "Urgent transfer to new beneficiary with shared contact and proxy behavior."
  },
  {
    customerName: "Nisha Kapoor",
    accountId: "ACC-NH-661",
    amount: "180000",
    currency: "EUR",
    destinationCountry: "Hong Kong",
    channel: "Wire",
    narrative: "High-value split settlement across offshore counterparties under time pressure."
  },
  {
    customerName: "Vikram Rao",
    accountId: "ACC-NH-889",
    amount: "75000",
    currency: "USD",
    destinationCountry: "Singapore",
    channel: "Card",
    narrative: "Repeated external merchant payments to newly added payee network."
  },
  {
    customerName: "Riya Sen",
    accountId: "ACC-NH-105",
    amount: "1200",
    currency: "INR",
    destinationCountry: "Local",
    channel: "Card",
    narrative: "Monthly software subscription and regular bill payment."
  }
];

const randomItem = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

export default function InputPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [progressLabel, setProgressLabel] = useState<string>("");
  const [jobStatus, setJobStatus] = useState<"idle" | "queued" | "running" | "succeeded" | "failed">("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeJobId, setActiveJobId] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    accountId: "",
    amount: "",
    currency: "USD",
    destinationCountry: "Local",
    channel: "Wire",
    narrative: "",
    geminiApiKey: ""
  });

  const fillRandomDemoInput = () => {
    const profile = randomItem(demoProfiles);
    setForm((prev) => ({ ...prev, ...profile }));
    setError("");
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const amount = Number(form.amount);
    if (!form.customerName || !form.accountId || !form.narrative || Number.isNaN(amount) || amount <= 0) {
      setError("Please fill all fields with a valid amount.");
      return;
    }

    setIsRunning(true);
    setJobStatus("queued");
    setElapsedSeconds(0);
    setActiveJobId("");
    setProgressLabel("Starting local backend job...");
    const startedAt = Date.now();

    try {
      const response = await fetch("/api/cases/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerName: form.customerName,
          accountId: form.accountId,
          amount,
          currency: form.currency,
          destinationCountry: form.destinationCountry,
          channel: form.channel,
          narrative: form.narrative,
          geminiApiKey: form.geminiApiKey.trim() || undefined
        })
      });

      const data = (await response.json()) as { jobId?: string; error?: string };
      if (!response.ok || !data.jobId) {
        throw new Error(data.error ?? "Pipeline run failed.");
      }

      const jobId = data.jobId;
      setActiveJobId(jobId);
      const maxPolls = 180;

      let resolvedRecord: CaseRecord | null = null;
      for (let i = 0; i < maxPolls; i += 1) {
        setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
        if (i % 5 === 0) {
          setProgressLabel("Agents are running in background...");
        }

        const jobResponse = await fetch(`/api/cases/jobs/${jobId}`, {
          method: "GET",
          cache: "no-store"
        });

        const jobData = (await jobResponse.json()) as {
          status?: "queued" | "running" | "succeeded" | "failed";
          caseRecord?: CaseRecord;
          error?: string;
        };

        if (!jobResponse.ok) {
          throw new Error(jobData.error ?? "Job status check failed.");
        }

        if (jobData.status === "queued" || jobData.status === "running") {
          setJobStatus(jobData.status);
        }

        if (jobData.status === "succeeded" && jobData.caseRecord) {
          setJobStatus("succeeded");
          resolvedRecord = jobData.caseRecord;
          break;
        }

        if (jobData.status === "failed") {
          setJobStatus("failed");
          throw new Error(jobData.error ?? "Background agent execution failed.");
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if (!resolvedRecord) {
        throw new Error("Pipeline timed out. Please retry.");
      }

      saveCaseRecord(resolvedRecord);
      router.push("/agents/sentry");
    } catch (runError) {
      setJobStatus("failed");
      setError(runError instanceof Error ? runError.message : "Pipeline execution failed.");
    } finally {
      setProgressLabel("");
      setIsRunning(false);
    }
  };

  return (
    <section className="panel input-wrap reveal-up">
      <div className="input-head">
        <h1>Create Investigation Case</h1>
        <button type="button" className="btn btn-ghost dice-btn" onClick={fillRandomDemoInput} disabled={isRunning}>
          Dice Autofill Demo
        </button>
      </div>
      <p className="section-copy">Input transaction details once to drive all downstream agent analysis pages.</p>

      {jobStatus !== "idle" ? (
        <article className="run-status-card">
          <p className="run-status-title">Backend Run Status</p>
          <div className="run-status-grid">
            <p>
              State
              <strong className={`run-status-chip ${jobStatus}`}>{jobStatus.toUpperCase()}</strong>
            </p>
            <p>
              Elapsed
              <strong>{elapsedSeconds}s</strong>
            </p>
            <p>
              Job
              <strong>{activeJobId ? activeJobId.slice(0, 8) : "Pending"}</strong>
            </p>
          </div>
          {isRunning && progressLabel ? <p className="section-copy">{progressLabel}</p> : null}
        </article>
      ) : null}

      <form onSubmit={onSubmit} className="form-grid">
        <label>
          Customer Name
          <input
            value={form.customerName}
            onChange={(event) => setForm((prev) => ({ ...prev, customerName: event.target.value }))}
            placeholder="Aarav Mehta"
          />
        </label>

        <label>
          Account ID
          <input
            value={form.accountId}
            onChange={(event) => setForm((prev) => ({ ...prev, accountId: event.target.value }))}
            placeholder="ACC-900182"
          />
        </label>

        <label>
          Amount
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
            placeholder="42000"
          />
        </label>

        <label>
          Currency
          <select
            value={form.currency}
            onChange={(event) => setForm((prev) => ({ ...prev, currency: event.target.value }))}
          >
            {currencies.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Destination Country
          <select
            value={form.destinationCountry}
            onChange={(event) => setForm((prev) => ({ ...prev, destinationCountry: event.target.value }))}
          >
            {countries.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Channel
          <select
            value={form.channel}
            onChange={(event) => setForm((prev) => ({ ...prev, channel: event.target.value }))}
          >
            {channels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="narrative-field">
          Narrative
          <textarea
            rows={4}
            value={form.narrative}
            onChange={(event) => setForm((prev) => ({ ...prev, narrative: event.target.value }))}
            placeholder="Urgent transfer to new beneficiary for investment settlement."
          />
        </label>

        <label className="narrative-field">
          Gemini API Key (Optional)
          <input
            type="password"
            value={form.geminiApiKey}
            onChange={(event) => setForm((prev) => ({ ...prev, geminiApiKey: event.target.value }))}
            placeholder="Paste key to run Scribe with Gemini instead of Ollama"
            autoComplete="off"
          />
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <button type="submit" className="btn btn-solid" disabled={isRunning}>
          {isRunning ? "Running Agents In Background..." : "Run Real Agent Pipeline"}
        </button>
      </form>
    </section>
  );
}
