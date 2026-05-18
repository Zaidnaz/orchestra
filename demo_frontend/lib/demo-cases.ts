import { CaseRecord } from "./types";

export interface DemoCase {
  id: string;
  label: string;
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  description: string;
  record: CaseRecord;
}

const DEMO_CASES: DemoCase[] = [
  {
    id: "demo-hawala-block",
    label: "Hawala Network — BLOCK",
    riskLevel: "CRITICAL",
    description: "High-value structuring to UAE via shared proxy accounts. I4C hit confirmed.",
    record: {
      caseId: "CASE-DEMO-001",
      createdAt: "2025-05-18T09:14:33.000Z",
      transaction: {
        customerName: "Aarav Mehta",
        accountId: "ACC-NH-204",
        amount: 920000,
        currency: "USD",
        destinationCountry: "UAE",
        channel: "Mobile Banking",
        narrative: "Urgent transfer to new beneficiary with shared contact and proxy behavior. Multiple splits across offshore counterparties."
      },
      analyses: {
        sentry: {
          summary: "CRITICAL anomaly detected — I4C registry hit combined with structuring pattern and offshore velocity breach.",
          score: 94,
          highlights: [
            "RC-000: Customer flagged in I4C cybercrime registry — automatic escalation triggered",
            "RC-012: Structuring pattern detected — 3 transfers of ₹9.2L within 72-hour window",
            "RC-004: Velocity breach — 7 transactions to new UAE beneficiaries in 60 minutes",
            "RC-002: PMLA threshold exceeded — single transfer USD 9,20,000 (>₹10L equivalent)",
            "Adversarial probe guardrail triggered — repeated near-threshold probing behavior"
          ],
          recommendation: "Immediate BLOCK. Escalate to Principal Officer and file STR within 7 days per PMLA Section 12A."
        },
        researcher: {
          summary: "Entity graph reveals shared device across 4 flagged accounts. Impossible-travel indicator active on current session.",
          score: 88,
          highlights: [
            "Device DEV-204 linked to 4 other accounts flagged for similar UAE transfers in past 30 days",
            "Impossible-travel detected — login from Mumbai at 09:02, transaction initiated from Dubai IP at 09:11",
            "Beneficiary BEN-WEB shares phone number with 2 accounts under prior STR investigation (CASE-2024-88, CASE-2024-91)",
            "Account opened 6 weeks ago — accelerated KYC, no prior transaction history beyond ₹50,000",
            "Rolling 30-day volume: USD 46,00,000 across linked accounts — 92× baseline"
          ],
          recommendation: "Full EDD required. Freeze linked accounts pending investigation. Notify FIU-India."
        },
        compliance: {
          summary: "Tier 1 BLOCK verdict — I4C hit mandates immediate action per RBI KYC Master Direction Para 38(iii).",
          score: 96,
          highlights: [
            "PMLA Section 12A: Reporting Entity must file STR within 7 days of suspicion — threshold met",
            "RBI KYC Para 38(iii): I4C-flagged customer — immediate freeze and report obligation",
            "FATF Recommendation 16: Wire transfer with incomplete originator information — compliance failure",
            "Internal Policy CP-AML-04: Cross-border transfer >USD 1,00,000 requires enhanced beneficiary verification — not completed",
            "Escalation Rate: 0% (well within 5% automation threshold) — automated BLOCK permitted"
          ],
          recommendation: "BLOCK + FILE STR. Preserve transaction records. Notify compliance officer within 4 hours."
        },
        scribe: {
          summary: "SAR narrative compiled — chronological evidence chain from anomaly detection to regulatory filing recommendation.",
          score: 91,
          highlights: [
            "Timeline: 09:02 login (Mumbai) → 09:11 transaction attempt (Dubai IP) — 9-minute impossible travel",
            "Evidence: Device linkage graph, I4C registry confirmation, velocity analysis, beneficiary network map",
            "Regulatory citations: PMLA S.12A, RBI KYC Para 38(iii), FATF R.16 — all triggered",
            "Action items: STR filing, account freeze, FIU-India notification, 5-year record preservation"
          ],
          recommendation: "Publish STR. Archive full evidence package to case folder CASE-DEMO-001."
        }
      },
      finalVerdict: "BLOCK",
      sarReport: `# Suspicious Activity Report
**Case ID:** CASE-DEMO-001
**Filed:** 18 May 2025, 09:47 IST
**Classification:** CRITICAL — Hawala Network / Structuring
**Reporting Entity:** New Horizon Financial Intelligence Unit

---

## Executive Summary

This report documents a CRITICAL-band financial crime alert raised against customer **Aarav Mehta** (ACC-NH-204) following an attempted USD 9,20,000 transfer to a United Arab Emirates beneficiary via Mobile Banking channel. The transaction triggered an **I4C cybercrime registry hit** (RC-000), structuring pattern flags (RC-012), and a velocity breach (RC-004) within a 60-minute window. An impossible-travel indicator was confirmed between login origin (Mumbai, IN) and transaction IP origin (Dubai, AE).

---

## Subject Profile

| Field | Value |
|---|---|
| Customer ID | CUST-AARAVMEHTA |
| Account | ACC-NH-204 (opened 6 weeks prior) |
| KYC Status | Verified — accelerated onboarding |
| Risk Level | CRITICAL (elevated post-alert) |
| PEP / Sanctions | No match at onboarding; I4C hit post-transaction |

---

## Transaction Details

| Field | Value |
|---|---|
| Transaction ID | TXN-1716020073 |
| Amount | USD 9,20,000 |
| Destination | UAE (BEN-WEB) |
| Channel | Mobile Banking |
| Timestamp | 2025-05-18 09:11 UTC |
| Origin IP | 185.220.101.1 (Tor exit node, UAE geolocation) |

---

## Anomaly Evidence

### 1. I4C Registry Hit (RC-000)
The customer's account was matched against the Indian Cyber Crime Coordination Centre (I4C) registry at transaction initiation. This constitutes an automatic escalation trigger under internal policy CP-AML-04 and RBI KYC Master Direction Para 38(iii).

### 2. Structuring Pattern (RC-012)
Sentry detected three transfers of USD ~3,06,000 each over a 72-hour window — a classic structuring pattern to evade the ₹10L PMLA single-transaction reporting threshold. Combined value: USD 9,20,000.

### 3. Impossible Travel
Authentication occurred from a verified Mumbai device at 09:02 IST. Transaction was initiated from a Tor exit node geolocated to Dubai at 09:11 IST — a 9-minute gap making physical travel impossible.

### 4. Device Linkage
Device DEV-204 is shared across four additional customer accounts, all of which have filed STRs in the past 90 days (CASE-2024-88, CASE-2024-91, CASE-2024-94, CASE-2024-97). This indicates a coordinated account takeover or money mule network.

---

## Regulatory Basis

- **PMLA Section 12A** — Obligation to file STR within 7 days of suspicion crystallising
- **RBI KYC Master Direction Para 38(iii)** — Mandatory freeze on I4C-flagged accounts
- **FATF Recommendation 16** — Wire transfer without complete originator information
- **Internal Policy CP-AML-04** — Cross-border transfer >USD 1,00,000 requires enhanced beneficiary verification

---

## Recommended Actions

1. ✅ **Immediate transaction block** — executed at detection (09:14 IST)
2. 📋 **STR filing** — to FIU-India within 7 days per PMLA S.12A
3. 🔒 **Account freeze** — ACC-NH-204 and 4 linked accounts
4. 📞 **FIU-India notification** — within 4 hours per circular FIU/AML/2024-08
5. 📁 **Record preservation** — 5-year retention per PMLA S.12(1)(a)

---

*Report generated by New Horizon Autonomous Investigation Pipeline v1.0*
*Confidence Score: 96/100 — Automated BLOCK permitted (escalation rate: 0%)*`
    }
  },

  {
    id: "demo-crypto-review",
    label: "Crypto Layering — REVIEW",
    riskLevel: "HIGH",
    description: "Split settlement to Hong Kong via crypto exchange. Structuring indicators.",
    record: {
      caseId: "CASE-DEMO-002",
      createdAt: "2025-05-17T14:22:10.000Z",
      transaction: {
        customerName: "Nisha Kapoor",
        accountId: "ACC-NH-661",
        amount: 180000,
        currency: "EUR",
        destinationCountry: "Hong Kong",
        channel: "Crypto Exchange",
        narrative: "High-value split settlement across offshore counterparties under time pressure. Settlement for business investment."
      },
      analyses: {
        sentry: {
          summary: "HIGH anomaly — Crypto exchange channel with offshore split settlement pattern and compressed timeline.",
          score: 78,
          highlights: [
            "RC-012: Split settlement pattern — EUR 60,000 × 3 tranches across 4-hour window",
            "RC-003: Rolling 30-day PMLA threshold breached — EUR 8,40,000 cumulative (>₹50L equivalent)",
            "Crypto Exchange channel — elevated risk tier; VASP compliance status unverified",
            "RC-004: 9 transactions to Hong Kong beneficiaries in current month — 4.5× account baseline",
            "Narrative urgency phrase detected: 'time pressure'"
          ],
          recommendation: "Hold 24 hours. Request source-of-funds documentation and VASP compliance certificate."
        },
        researcher: {
          summary: "Account history shows sudden activity spike. Beneficiary entity is a newly registered HK shell company.",
          score: 71,
          highlights: [
            "Beneficiary HK-INVEST-LLC registered 11 days ago — no prior business relationship",
            "EUR 8,40,000 rolling 30-day volume — account baseline was EUR 12,000/month",
            "No prior cross-border transfers in 24-month account history",
            "IP geolocation consistent (Delhi, IN) — no impossible-travel indicator",
            "KYC documents last updated 14 months ago — refresh required for this transaction tier"
          ],
          recommendation: "Request Enhanced Due Diligence documents. Verify beneficial ownership of HK counterparty."
        },
        compliance: {
          summary: "HOLD 24H verdict — EDD required before proceeding. No automatic block warranted at this score.",
          score: 74,
          highlights: [
            "PMLA Section 12(1)(c): Rolling threshold of ₹50L in 30 days — reporting obligation triggered",
            "RBI KYC Para 56: Crypto exchange transactions — VASP registration verification required",
            "Internal Policy CP-FX-02: Offshore transfer >EUR 50,000 requires fresh source-of-funds",
            "No I4C hit, no sanctions match — automated HOLD permissible"
          ],
          recommendation: "HOLD 24H pending EDD. If documents unsatisfactory, escalate to FILE STR."
        },
        scribe: {
          summary: "Investigation narrative compiled. EDD checklist generated for compliance officer review.",
          score: 72,
          highlights: [
            "Timeline: 14 days of account activity spike → 3-tranche split over 4 hours → HOLD triggered",
            "EDD checklist: source-of-funds, beneficial ownership of HK-INVEST-LLC, VASP certificate",
            "Regulatory basis: PMLA S.12(1)(c), RBI KYC Para 56"
          ],
          recommendation: "Issue EDD request. Set 24-hour review deadline. Escalate to STR if unresolved."
        }
      },
      finalVerdict: "REVIEW",
      sarReport: `# Investigation Hold Notice
**Case ID:** CASE-DEMO-002
**Initiated:** 17 May 2025, 14:22 IST
**Classification:** HIGH — Crypto Layering / Split Settlement
**Status:** HOLD 24H — Enhanced Due Diligence Required

---

## Summary

Customer **Nisha Kapoor** (ACC-NH-661) initiated a EUR 1,80,000 transfer via Crypto Exchange channel to a newly registered Hong Kong entity. Sentry detected a 3-tranche split settlement pattern (RC-012) and PMLA rolling threshold breach (RC-003). No I4C hit. Automated HOLD issued pending EDD.

## EDD Requirements

1. Source of funds documentation for EUR 1,80,000
2. Beneficial ownership structure of HK-INVEST-LLC
3. VASP compliance certificate for crypto exchange counterparty
4. Business purpose certification from account holder

## Deadline: 18 May 2025, 14:22 IST

*Generated by New Horizon Autonomous Investigation Pipeline v1.0*`
    }
  },

  {
    id: "demo-merchant-review",
    label: "Unusual Payee Network — REVIEW",
    riskLevel: "MEDIUM",
    description: "Repeated payments to new merchant network in Singapore. Moderate risk.",
    record: {
      caseId: "CASE-DEMO-003",
      createdAt: "2025-05-16T11:05:45.000Z",
      transaction: {
        customerName: "Vikram Rao",
        accountId: "ACC-NH-889",
        amount: 75000,
        currency: "USD",
        destinationCountry: "Singapore",
        channel: "Card",
        narrative: "Repeated external merchant payments to newly added payee network. Invoice settlement for consulting services."
      },
      analyses: {
        sentry: {
          summary: "MEDIUM anomaly — card payments to unfamiliar Singapore merchant cluster with above-baseline frequency.",
          score: 55,
          highlights: [
            "RC-004: 12 card transactions to Singapore merchants added in past 7 days",
            "New payee network — no prior relationship with any of these 6 merchants",
            "USD 75,000 — above PMLA single-transaction notification threshold",
            "Card channel — lower risk than Wire but unusual for B2B invoice settlement",
            "No I4C hit, no structuring pattern detected"
          ],
          recommendation: "Forward to researcher for payee legitimacy check."
        },
        researcher: {
          summary: "All 6 merchants are registered Singapore entities. Business relationship plausible but unverified.",
          score: 48,
          highlights: [
            "6 Singapore merchant accounts added via self-service portal in 7-day window",
            "ACRA registration confirmed for 4 of 6 merchants — 2 pending verification",
            "Account holder has prior USD 45,000 Singapore transaction history (18 months ago)",
            "No device linkage anomalies, no impossible-travel, consistent IP pattern",
            "Invoice provided for 3 of 6 payments — 3 missing documentation"
          ],
          recommendation: "Request invoices for undocumented payments. Moderate risk — proceed with monitoring."
        },
        compliance: {
          summary: "REVIEW verdict — missing invoice documentation for 3 payments. No mandatory STR obligation triggered.",
          score: 52,
          highlights: [
            "PMLA Section 12(1)(b): USD 75,000 triggers enhanced monitoring — not mandatory STR",
            "Internal Policy CP-FX-01: Invoice required for all B2B cross-border payments >USD 10,000",
            "3 missing invoices — policy breach requiring documentation before clearance",
            "No sanctions match, no PEP match, no I4C flag"
          ],
          recommendation: "Request 3 missing invoices within 48 hours. Allow if provided; escalate if refused."
        },
        scribe: {
          summary: "Case documented for audit trail. Low-complexity investigation — documentation gap only.",
          score: 49,
          highlights: [
            "Missing documentation for 3 Singapore merchant payments",
            "48-hour documentation request issued",
            "No STR obligation at current risk level"
          ],
          recommendation: "Archive case pending invoice receipt. Auto-clear if resolved within 48 hours."
        }
      },
      finalVerdict: "REVIEW",
      sarReport: `# Case Review Notice
**Case ID:** CASE-DEMO-003
**Initiated:** 16 May 2025, 11:05 IST
**Classification:** MEDIUM — Unusual Payee / Documentation Gap
**Status:** REVIEW — Invoice Documentation Required

---

## Summary

Customer **Vikram Rao** (ACC-NH-889) initiated USD 75,000 in card payments to a newly added Singapore merchant network. 3 of 6 payments lack invoice documentation per CP-FX-01. No I4C hit, no structuring pattern. Automated REVIEW issued.

## Action Required

Request invoices for payments to SG-MERCH-04, SG-MERCH-05, SG-MERCH-06 within 48 hours.

*Generated by New Horizon Autonomous Investigation Pipeline v1.0*`
    }
  },

  {
    id: "demo-routine-allow",
    label: "Routine Transaction — ALLOW",
    riskLevel: "LOW",
    description: "Standard domestic card payment — subscription and bill settlement. No flags.",
    record: {
      caseId: "CASE-DEMO-004",
      createdAt: "2025-05-15T08:30:00.000Z",
      transaction: {
        customerName: "Riya Sen",
        accountId: "ACC-NH-105",
        amount: 1200,
        currency: "INR",
        destinationCountry: "Local",
        channel: "Card",
        narrative: "Monthly software subscription and regular bill payment to known domestic merchant."
      },
      analyses: {
        sentry: {
          summary: "LOW risk — domestic card transaction within established behavioral baseline. No anomaly flags.",
          score: 12,
          highlights: [
            "Transaction amount INR 1,200 — well below all PMLA thresholds",
            "Domestic destination — no cross-border risk",
            "Card channel — consistent with 24-month account history",
            "Known recurring merchant — 11 identical prior transactions",
            "No reason codes triggered across all 11 rule checks"
          ],
          recommendation: "No escalation required. Allow with standard monitoring."
        },
        researcher: {
          summary: "Account fully consistent with established customer profile. No anomalies in context enrichment.",
          score: 10,
          highlights: [
            "Merchant MERCH-SUB-01 present in account for 23 months — fully known payee",
            "Transaction matches recurring monthly pattern (within ±3 days, ±INR 150)",
            "Login from registered home device, consistent IP, no travel anomaly",
            "KYC fully current, no PEP/sanctions match, no prior case annotations"
          ],
          recommendation: "Allow. No further investigation required."
        },
        compliance: {
          summary: "ALLOW — No regulatory obligation triggered. Transaction is within normal parameters.",
          score: 8,
          highlights: [
            "INR 1,200 — 0.12% of PMLA single-transaction threshold",
            "All KYC obligations current",
            "Routine transaction category — no enhanced monitoring required"
          ],
          recommendation: "ALLOW with standard monitoring. No STR or EDD obligation."
        },
        scribe: {
          summary: "Informational case log — no action required. Filed for audit completeness.",
          score: 9,
          highlights: [
            "Routine transaction within expected behavioral envelope",
            "No investigation artifacts required",
            "Case closed as ALLOW"
          ],
          recommendation: "Archive case log. No action."
        }
      },
      finalVerdict: "ALLOW",
      sarReport: `# Case Log — No Action Required
**Case ID:** CASE-DEMO-004
**Date:** 15 May 2025, 08:30 IST
**Classification:** LOW — Routine Domestic Transaction
**Status:** ALLOW — No regulatory obligation triggered

Customer Riya Sen (ACC-NH-105) completed a routine INR 1,200 domestic card payment consistent with 23-month transaction history. All checks passed. Case archived for audit completeness.

*Generated by New Horizon Autonomous Investigation Pipeline v1.0*`
    }
  }
];

export const getDemoCase = (id: string): DemoCase | undefined =>
  DEMO_CASES.find((c) => c.id === id);

export const getAllDemoCases = (): DemoCase[] => DEMO_CASES;

export const DEMO_RISK_COLORS: Record<DemoCase["riskLevel"], string> = {
  CRITICAL: "var(--danger)",
  HIGH: "var(--warning)",
  MEDIUM: "#1a6fa8",
  LOW: "var(--brand)"
};

export const DEMO_RISK_BG: Record<DemoCase["riskLevel"], string> = {
  CRITICAL: "var(--danger-light)",
  HIGH: "var(--warning-light)",
  MEDIUM: "#e8f4ff",
  LOW: "var(--brand-light)"
};
