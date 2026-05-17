// Enhanced Tracker Context with Supabase Real-time Sync
// Automatically syncs all changes across connected users

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
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
import {
  isSupabaseConfigured,
  updateDocumentInSupabase,
  updatePhaseTaskInSupabase,
  updateSectionInSupabase,
  useSupabaseSync,
} from "@/hooks/useSupabaseSync";

interface TrackerContextValue {
  sections: Section[];
  documents: Document[];
  phases: Phase[];
  isOnline: boolean;
  isSyncing: boolean;
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
const supabaseEnabled = isSupabaseConfigured();

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

export function SupabaseTrackerProvider({ children }: { children: React.ReactNode }) {
  const [sections, setSections] = useState<Section[]>(() =>
    loadFromStorage(`${STORAGE_KEY}-sections`, INITIAL_SECTIONS)
  );
  const [documents, setDocuments] = useState<Document[]>(() =>
    loadFromStorage(`${STORAGE_KEY}-documents`, INITIAL_DOCUMENTS)
  );
  const [phases, setPhases] = useState<Phase[]>(() =>
    loadFromStorage(`${STORAGE_KEY}-phases`, INITIAL_PHASES)
  );
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Supabase real-time sync
  useSupabaseSync(
    (state) => {
      setSections(state.sections);
      setDocuments(state.documents);
      setPhases(state.phases);
      localStorage.setItem(`${STORAGE_KEY}-sections`, JSON.stringify(state.sections));
      localStorage.setItem(`${STORAGE_KEY}-documents`, JSON.stringify(state.documents));
      localStorage.setItem(`${STORAGE_KEY}-phases`, JSON.stringify(state.phases));
    },
    supabaseEnabled
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

  // Network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Back online — syncing changes");
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error("Offline — changes will sync when back online");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const updateSectionStatus = (id: string, status: TaskStatus) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    if (supabaseEnabled) updateSectionInSupabase(id, { status });
  };

  const updateSectionProgress = (id: string, progress: number) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, progress } : s)));
    if (supabaseEnabled) updateSectionInSupabase(id, { progress });
  };

  const updateSectionLeads = (id: string, leadIds: string[]) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, leadIds } : s)));
    if (supabaseEnabled) updateSectionInSupabase(id, { leadIds });
  };

  const updateSectionNotes = (id: string, notes: string) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, notes } : s)));
    if (supabaseEnabled) updateSectionInSupabase(id, { notes });
  };

  const updateDocStatus = (id: string, status: DocStatus) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
    if (supabaseEnabled) updateDocumentInSupabase(id, { status });
  };

  const updateDocStatusNote = (id: string, statusNote: string) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, statusNote } : d)));
    if (supabaseEnabled) updateDocumentInSupabase(id, { statusNote });
  };

  const updateDocResponsible = (id: string, responsibleId: string) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, responsibleId } : d)));
    if (supabaseEnabled) updateDocumentInSupabase(id, { responsibleId });
  };

  const togglePhaseTask = (phaseId: string, taskId: string) => {
    setPhases((prev) =>
      prev.map((p) =>
        p.id === phaseId
          ? { ...p, tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)) }
          : p
      )
    );
    if (supabaseEnabled) {
      const phase = phases.find((p) => p.id === phaseId);
      const task = phase?.tasks.find((t) => t.id === taskId);
      if (task) updatePhaseTaskInSupabase(phaseId, taskId, { done: !task.done });
    }
  };

  const reassignPhaseTask = (phaseId: string, taskId: string, ownerId: string) => {
    setPhases((prev) =>
      prev.map((p) =>
        p.id === phaseId
          ? { ...p, tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, ownerId } : t)) }
          : p
      )
    );
    if (supabaseEnabled) updatePhaseTaskInSupabase(phaseId, taskId, { ownerId });
  };

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
        isOnline,
        isSyncing,
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
  if (!ctx) throw new Error("useTracker must be used within SupabaseTrackerProvider");
  return ctx;
}
