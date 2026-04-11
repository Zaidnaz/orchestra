import { CaseRecord } from "@/lib/types";

interface CaseSummaryProps {
  record: CaseRecord;
}

export function CaseSummary({ record }: CaseSummaryProps) {
  return (
    <section className="case-summary panel">
      <h3>Case Snapshot</h3>
      <div className="summary-grid">
        <article>
          <p>Case</p>
          <strong>{record.caseId}</strong>
        </article>
        <article>
          <p>Customer</p>
          <strong>{record.transaction.customerName}</strong>
        </article>
        <article>
          <p>Amount</p>
          <strong>
            {record.transaction.currency} {record.transaction.amount.toLocaleString()}
          </strong>
        </article>
        <article>
          <p>Verdict</p>
          <strong>{record.finalVerdict}</strong>
        </article>
      </div>
    </section>
  );
}
