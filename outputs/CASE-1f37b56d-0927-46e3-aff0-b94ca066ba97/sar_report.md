# Suspicious Transaction Investigation Report

## Case Metadata
Case ID: CASE-1f37b56d-0927-46e3-aff0-b94ca066ba97
Report Timestamp: 2026-04-09 18:56:34 UTC
Risk Score: 1.00
Verdict Recommendation: BLOCK

## Customer Profile
Customer Name: Rahul Sharma
Customer ID: CUST001
Country: IN
KYC Status: verified

## Investigation Summary
Case Metadata

## Evidence Collected
Evidence signals are summarized from the investigator and compliance payloads.
- Customer logged in from different countries within a short window, indicating impossible travel.
- Current login IP is associated with VPN or proxy behavior.
- Device has been linked to 4 accounts associated with prior mule-like behavior.
- Alert was triggered by MULTI_LAYER_ANOMALY with risk score 1.0.
- Reason codes: RC-003, RC-005, RC-011, SHARED_DEVICE_RISK, VPN_OR_PROXY_SIGNAL

## Transaction Details
- TXN555 | USD 9,500.00 | AE | mobile_app | 2026-04-09T09:45:00+00:00

## Device Risk Signals
Device ID: DEV-44 | Device Risk Score: 0.86

## Login Activity
- 2026-04-09T18:54:48.420887+00:00 | AE | 185.220.101.1

## Regulatory Risk Analysis
Regulatory flags and compliance reasoning indicate elevated AML risk.

## Risk Score Assessment
Critical risk

## Investigation Timeline
- 2026-04-09 09:45:00: Transfer initiated: TXN555 USD 9,500.00 to AE via mobile_app
- 2026-04-09 18:54:48: Login from AE (IP: 185.220.101.1)

## Final Compliance Recommendation
Escalate for human compliance review and FIU-IND filing assessment.
