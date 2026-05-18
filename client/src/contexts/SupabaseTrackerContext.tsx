"use client";
// Supabase-first tracker context
// All data is fetched from Supabase on mount and synced in real-time
// No localStorage fallback to avoid sandbox/iframe issues

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { toast } from "sonner";
import {
  INITIAL_DOCUMENTS,
  INITIAL_PHASES,
  INITIAL_SECTIONS,
  TEAM_MEMBERS,
  type Document,
  type DocStatus,
  type Phase,
  type Section,
  type TeamMember,
  type TaskStatus,
} from "@/lib/data";
import {
  updateDocumentInSupabase,
  updatePhaseTaskInSupabase,
  updateSectionInSupabase,
  useSupabaseSync,
  isSupabaseConfigured,
} from "@/hooks/useSupabaseSync";

interface TrackerContextValue {
  sections: Section[];
  documents: Document[];
  phases: Phase[];
  teamMembers: TeamMember[];
  isOnline: boolean;
  isSyncing: boolean;
  supabaseConfigured: boolean;
  updateSectionStatus: (id: string, status: TaskStatus) => void;
  updateSectionProgress: (id: string, progress: number) => void;
  updateSectionLeads: (id: string, leadIds: string[]) => void;
  updateSectionNotes: (id: string, notes: string) => void;
  updateDocStatus: (id: string, status: DocStatus) => void;
  updateDocStatusNote: (id: string, note: string) => void;
  updateDocResponsible: (id: string, responsibleId: string) => void;
  updateTeamMember: (
    id: string,
    updates: Partial<Omit<TeamMember, "id">>
  ) => void;
  togglePhaseTask: (phaseId: string, taskId: string) => void;
  reassignPhaseTask: (phaseId: string, taskId: string, ownerId: string) => void;
  resetAll: () => void;
}

const TrackerContext = createContext<TrackerContextValue | null>(null);

const supabaseEnabled = isSupabaseConfigured();

export function SupabaseTrackerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // State: always start with initial data, will be replaced by Supabase data on mount
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
  const [phases, setPhases] = useState<Phase[]>(INITIAL_PHASES);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(TEAM_MEMBERS);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Handle Supabase sync updates
  const handleSupabaseUpdate = useCallback((state: any) => {
    setSections(state.sections || INITIAL_SECTIONS);
    setDocuments(state.documents || INITIAL_DOCUMENTS);
    setPhases(state.phases || INITIAL_PHASES);
    setIsSyncing(false);
  }, []);

  // Real-time sync hook
  useSupabaseSync(handleSupabaseUpdate, supabaseEnabled);

  // Update handlers
  const updateSectionStatus = useCallback((id: string, status: TaskStatus) => {
    setSections(prev => prev.map(s => (s.id === id ? { ...s, status } : s)));
    updateSectionInSupabase(id, { status });
  }, []);

  const updateSectionProgress = useCallback((id: string, progress: number) => {
    setSections(prev => prev.map(s => (s.id === id ? { ...s, progress } : s)));
    updateSectionInSupabase(id, { progress });
  }, []);

  const updateSectionLeads = useCallback((id: string, leadIds: string[]) => {
    setSections(prev => prev.map(s => (s.id === id ? { ...s, leadIds } : s)));
    updateSectionInSupabase(id, { leadIds });
  }, []);

  const updateSectionNotes = useCallback((id: string, notes: string) => {
    setSections(prev => prev.map(s => (s.id === id ? { ...s, notes } : s)));
    updateSectionInSupabase(id, { notes });
  }, []);

  const updateDocStatus = useCallback((id: string, status: DocStatus) => {
    setDocuments(prev => prev.map(d => (d.id === id ? { ...d, status } : d)));
    updateDocumentInSupabase(id, { status });
  }, []);

  const updateDocStatusNote = useCallback((id: string, statusNote: string) => {
    setDocuments(prev =>
      prev.map(d => (d.id === id ? { ...d, statusNote } : d))
    );
    updateDocumentInSupabase(id, { statusNote });
  }, []);

  const updateDocResponsible = useCallback(
    (id: string, responsibleId: string) => {
      setDocuments(prev =>
        prev.map(d => (d.id === id ? { ...d, responsibleId } : d))
      );
      updateDocumentInSupabase(id, { responsibleId });
    },
    []
  );

  const updateTeamMember = useCallback(
    (id: string, updates: Partial<Omit<TeamMember, "id">>) => {
      setTeamMembers(prev =>
        prev.map(member =>
          member.id === id ? { ...member, ...updates } : member
        )
      );
    },
    []
  );

  const togglePhaseTask = useCallback(
    (phaseId: string, taskId: string) => {
      setPhases(prev =>
        prev.map(p =>
          p.id === phaseId
            ? {
                ...p,
                tasks: p.tasks.map(t =>
                  t.id === taskId ? { ...t, done: !t.done } : t
                ),
              }
            : p
        )
      );
      // Find current task state to toggle
      const phase = phases.find(p => p.id === phaseId);
      const task = phase?.tasks.find(t => t.id === taskId);
      updatePhaseTaskInSupabase(phaseId, taskId, { done: !task?.done });
    },
    [phases]
  );

  const reassignPhaseTask = useCallback(
    (phaseId: string, taskId: string, ownerId: string) => {
      setPhases(prev =>
        prev.map(p =>
          p.id === phaseId
            ? {
                ...p,
                tasks: p.tasks.map(t =>
                  t.id === taskId ? { ...t, ownerId } : t
                ),
              }
            : p
        )
      );
      updatePhaseTaskInSupabase(phaseId, taskId, { ownerId });
    },
    []
  );

  const resetAll = useCallback(() => {
    setSections(INITIAL_SECTIONS);
    setDocuments(INITIAL_DOCUMENTS);
    setPhases(INITIAL_PHASES);
    setTeamMembers(TEAM_MEMBERS);
    toast.success("Tracker reset to initial state");
  }, []);

  const value: TrackerContextValue = {
    sections,
    documents,
    phases,
    teamMembers,
    isOnline,
    isSyncing,
    supabaseConfigured: supabaseEnabled,
    updateSectionStatus,
    updateSectionProgress,
    updateSectionLeads,
    updateSectionNotes,
    updateDocStatus,
    updateDocStatusNote,
    updateDocResponsible,
    updateTeamMember,
    togglePhaseTask,
    reassignPhaseTask,
    resetAll,
  };

  return (
    <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
  );
}

export function useTracker() {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error("useTracker must be used within SupabaseTrackerProvider");
  }
  return context;
}
