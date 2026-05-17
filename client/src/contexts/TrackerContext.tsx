// ACHIEVE-SEA Grant Tracker — Global State Context
// Manages sections, documents, timeline phases with localStorage persistence

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  INITIAL_DOCUMENTS,
  INITIAL_PHASES,
  INITIAL_SECTIONS,
  type Document,
  type DocStatus,
  type Phase,
  type Section,
  type TaskStatus,
} from "@/lib/data";

interface TrackerContextValue {
  sections: Section[];
  documents: Document[];
  phases: Phase[];
  updateSectionStatus: (id: string, status: TaskStatus) => void;
  updateSectionProgress: (id: string, progress: number) => void;
  updateSectionLeads: (id: string, leadIds: string[]) => void;
  updateSectionNotes: (id: string, notes: string) => void;
  updateDocStatus: (id: string, status: DocStatus) => void;
  updateDocStatusNote: (id: string, note: string) => void;
  updateDocResponsible: (id: string, responsibleId: string) => void;
  togglePhaseTask: (phaseId: string, taskId: string) => void;
  reassignPhaseTask: (phaseId: string, taskId: string, ownerId: string) => void;
  resetAll: () => void;
}

const TrackerContext = createContext<TrackerContextValue | null>(null);

const STORAGE_KEY = "achieve-sea-tracker-v1";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

// Separate the provider and hook into named exports for Vite Fast Refresh compatibility
export function TrackerProvider({ children }: { children: React.ReactNode }) {
  const [sections, setSections] = useState<Section[]>(() =>
    loadFromStorage(`${STORAGE_KEY}-sections`, INITIAL_SECTIONS)
  );
  const [documents, setDocuments] = useState<Document[]>(() =>
    loadFromStorage(`${STORAGE_KEY}-documents`, INITIAL_DOCUMENTS)
  );
  const [phases, setPhases] = useState<Phase[]>(() =>
    loadFromStorage(`${STORAGE_KEY}-phases`, INITIAL_PHASES)
  );

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}-sections`, JSON.stringify(sections));
  }, [sections]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}-documents`, JSON.stringify(documents));
  }, [documents]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}-phases`, JSON.stringify(phases));
  }, [phases]);

  const updateSectionStatus = (id: string, status: TaskStatus) =>
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));

  const updateSectionProgress = (id: string, progress: number) =>
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, progress } : s)));

  const updateSectionLeads = (id: string, leadIds: string[]) =>
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, leadIds } : s)));

  const updateSectionNotes = (id: string, notes: string) =>
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, notes } : s)));

  const updateDocStatus = (id: string, status: DocStatus) =>
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));

  const updateDocStatusNote = (id: string, statusNote: string) =>
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, statusNote } : d)));

  const updateDocResponsible = (id: string, responsibleId: string) =>
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, responsibleId } : d)));

  const togglePhaseTask = (phaseId: string, taskId: string) =>
    setPhases((prev) =>
      prev.map((p) =>
        p.id === phaseId
          ? { ...p, tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)) }
          : p
      )
    );

  const reassignPhaseTask = (phaseId: string, taskId: string, ownerId: string) =>
    setPhases((prev) =>
      prev.map((p) =>
        p.id === phaseId
          ? { ...p, tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, ownerId } : t)) }
          : p
      )
    );

  const resetAll = () => {
    setSections(INITIAL_SECTIONS);
    setDocuments(INITIAL_DOCUMENTS);
    setPhases(INITIAL_PHASES);
  };

  return (
    <TrackerContext.Provider
      value={{
        sections,
        documents,
        phases,
        updateSectionStatus,
        updateSectionProgress,
        updateSectionLeads,
        updateSectionNotes,
        updateDocStatus,
        updateDocStatusNote,
        updateDocResponsible,
        togglePhaseTask,
        reassignPhaseTask,
        resetAll,
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
}

export function useTracker() {
  const ctx = useContext(TrackerContext);
  if (!ctx) throw new Error("useTracker must be used within TrackerProvider");
  return ctx;
}
