"use client";

import { CaseRecord } from "./types";

const CASE_KEY = "orchestra_case_record_v1";
const HISTORY_KEY = "orchestra_case_history_v1";
const MAX_HISTORY = 20;

export const saveCaseRecord = (record: CaseRecord): void => {
  window.localStorage.setItem(CASE_KEY, JSON.stringify(record));
  appendToHistory(record);
};

export const loadCaseRecord = (): CaseRecord | null => {
  const raw = window.localStorage.getItem(CASE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CaseRecord;
  } catch {
    return null;
  }
};

export const clearCaseRecord = (): void => {
  window.localStorage.removeItem(CASE_KEY);
};

const appendToHistory = (record: CaseRecord): void => {
  const existing = loadHistory();
  const withoutDupe = existing.filter((r) => r.caseId !== record.caseId);
  const updated = [record, ...withoutDupe].slice(0, MAX_HISTORY);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};

export const loadHistory = (): CaseRecord[] => {
  const raw = window.localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CaseRecord[];
  } catch {
    return [];
  }
};

export const clearHistory = (): void => {
  window.localStorage.removeItem(HISTORY_KEY);
  window.localStorage.removeItem(CASE_KEY);
};
