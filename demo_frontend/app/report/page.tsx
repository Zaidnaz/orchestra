"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CaseSummary } from "@/components/CaseSummary";
import { AGENT_LABELS, AGENT_ORDER } from "@/lib/agents";
import { downloadReportJson, downloadReportMarkdown, downloadReportPdf } from "@/lib/report";
import { clearCaseRecord, loadCaseRecord } from "@/lib/storage";
import { CaseRecord } from "@/lib/types";

export default function ReportPage() {
  const router = useRouter();
  const [record, setRecord] = useState<CaseRecord | null>(null);

  useEffect(() => {
    const loaded = loadCaseRecord();
    if (!loaded) {
      router.replace("/input");
      return;
    }

    setRecord(loaded);
  }, [router]);

  const averageScore = useMemo(() => {
    if (!record) {
      return 0;
    }

    const total = AGENT_ORDER.reduce((sum, agent) => sum + record.analyses[agent].score, 0);
    return Math.round(total / AGENT_ORDER.length);
  }, [record]);

  if (!record) {
    return <section className="panel loading-panel">Loading final report...</section>;
  }

  return (
    <section className="report-page reveal-up">
      <CaseSummary record={record} />

      <article className="panel report-hero">
        <p className="eyebrow">Final Report</p>
        <h1>Regulatory Decision: {record.finalVerdict}</h1>
        <p className="section-copy">
          Completed on {new Date(record.createdAt).toLocaleString()} with an aggregate confidence score of {averageScore}.
        </p>
      </article>

      <section className="report-grid">
        {AGENT_ORDER.map((agent) => (
          <article key={agent} className="panel report-card">
            <h3>{AGENT_LABELS[agent]}</h3>
            <p>{record.analyses[agent].summary}</p>
            <p className="report-score">Score: {record.analyses[agent].score} / 100</p>
            <ul>
              {record.analyses[agent].highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <article className="panel report-actions">
        <div>
          <h3>Next Action</h3>
          <p>{record.analyses.compliance.recommendation}</p>
        </div>
        <div className="report-buttons">
          <button className="btn btn-solid" onClick={() => downloadReportPdf(record)}>
            Download PDF
          </button>
          <button className="btn btn-ghost" onClick={() => downloadReportMarkdown(record)}>
            Download Markdown
          </button>
          <button className="btn btn-ghost" onClick={() => downloadReportJson(record)}>
            Download JSON
          </button>
          <Link href="/input" className="btn btn-solid">
            Start New Case
          </Link>
          <button
            className="btn btn-ghost"
            onClick={() => {
              clearCaseRecord();
              router.push("/");
            }}
          >
            Clear Session
          </button>
        </div>
      </article>
    </section>
  );
}
