# Orchestrator Agent

This folder contains a cross-repo orchestrator that runs the four investigation components in sequence:

1. The Sentry (`prithvi_clone/the-sentry`)
2. The Researcher (`sara_clone/The-Researcher`)
3. Compliance Officer (`vikrant_clone/FinAgent-Compliance-officer`)
4. The Scribe (`vignesh_clone/Scribe/scribe_agent`)

## What It Does

- Accepts transaction or Sentry alert JSON input.
- Runs each agent stage in order.
- Adapts schema differences between repos automatically.
- Stores per-case artifacts and a pipeline summary in `orchestrator_agent/outputs`.

## Quick Start

Run from workspace root:

```powershell
E:/hackathon/new_horizon/prithvi_clone/the-sentry/.venv/Scripts/python.exe orchestrator_agent/orchestrator.py
```

This uses `orchestrator_agent/inputs/transaction_sample.json` by default.

## Input Options

Transaction input (single object):

```powershell
E:/hackathon/new_horizon/prithvi_clone/the-sentry/.venv/Scripts/python.exe orchestrator_agent/orchestrator.py --input orchestrator_agent/inputs/transaction_sample.json --input-type transaction
```

Sentry alert input (single object):

```powershell
E:/hackathon/new_horizon/prithvi_clone/the-sentry/.venv/Scripts/python.exe orchestrator_agent/orchestrator.py --input sara_clone/The-Researcher/sample_data/sample_sentry_alert.json --input-type sentry-alert
```

Batch input (array):

- Use `--input-type transactions` for array of transaction objects.
- Use `--input-type sentry-alerts` for array of Sentry alerts.

## Output Files

For each case:

- `sentry_alert.json`
- `researcher_output.json`
- `compliance_output.json`
- `scribe_researcher_input.json`
- `scribe_result.json`
- `sar_report.md` (when Scribe ran successfully)
- `sar_report.json` (when Scribe ran successfully)

Global summary:

- `orchestrator_agent/outputs/pipeline_summary.json`

## Notes

- If Gemini SDK is unavailable, Compliance agent now falls back to deterministic rules.
- Scribe report persistence to its own repo outputs/SQLite is optional via `--persist-to-scribe-repo`.
- Researcher can run with local connectors (`--connector-mode local`) or HTTP mode (`--connector-mode http --internal-api-base-url ...`).
