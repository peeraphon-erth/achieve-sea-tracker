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
  insertTeamMemberInSupabase,
  updateTeamMemberInSupabase,
  deleteTeamMemberInSupabase,
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
  addTeamMember: (member: TeamMember) => Promise<{ ok: boolean; error?: string }>;
  validateMemberRemoval: (id: string) => {
    sections: number;
    documents: number;
    tasks: number;
    total: number;
  };
  removeTeamMember: (
    id: string,
    reassignToId: string
  ) => Promise<{ ok: boolean; error?: string }>;
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
    setTeamMembers(state.teamMembers || TEAM_MEMBERS);
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
      const previous = teamMembers;
      setTeamMembers(prev =>
        prev.map(member =>
          member.id === id ? { ...member, ...updates } : member
        )
      );
      updateTeamMemberInSupabase(id, updates).then(({ error }) => {
        if (error) {
          setTeamMembers(previous);
          toast.error("Failed to update team member");
        }
      });
    },
    [teamMembers]
  );

  const addTeamMember = useCallback(async (member: TeamMember) => {
    if (!member.id.trim()) {
      return { ok: false, error: "Member ID is required" };
    }
    if (teamMembers.some(m => m.id === member.id)) {
      return { ok: false, error: "Member ID already exists" };
    }
    const previous = teamMembers;
    setTeamMembers(prev => [...prev, member]);
    const { error } = await insertTeamMemberInSupabase(member);
    if (error) {
      setTeamMembers(previous);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  }, [teamMembers]);

  const validateMemberRemoval = useCallback(
    (id: string) => {
      const sectionCount = sections.filter(s => s.leadIds.includes(id)).length;
      const documentCount = documents.filter(d => d.responsibleId === id).length;
      const taskCount = phases.reduce(
        (count, phase) =>
          count + phase.tasks.filter(task => task.ownerId === id).length,
        0
      );
      return {
        sections: sectionCount,
        documents: documentCount,
        tasks: taskCount,
        total: sectionCount + documentCount + taskCount,
      };
    },
    [sections, documents, phases]
  );

  const removeTeamMember = useCallback(
    async (id: string, reassignToId: string) => {
      const targetExists = teamMembers.some(m => m.id === reassignToId);
      if (!targetExists) {
        return { ok: false, error: "Replacement member not found" };
      }

      const refs = validateMemberRemoval(id);
      if (refs.total > 0 && (!reassignToId || reassignToId === id)) {
        return {
          ok: false,
          error: "Reassignment is required before deleting this member",
        };
      }

      const prevSections = sections;
      const prevDocuments = documents;
      const prevPhases = phases;
      const prevMembers = teamMembers;

      const nextSections = sections.map(section => ({
        ...section,
        leadIds: section.leadIds.map(leadId =>
          leadId === id ? reassignToId : leadId
        ),
      }));
      const nextDocuments = documents.map(document =>
        document.responsibleId === id
          ? { ...document, responsibleId: reassignToId }
          : document
      );
      const nextPhases = phases.map(phase => ({
        ...phase,
        tasks: phase.tasks.map(task =>
          task.ownerId === id ? { ...task, ownerId: reassignToId } : task
        ),
      }));

      setSections(nextSections);
      setDocuments(nextDocuments);
      setPhases(nextPhases);
      setTeamMembers(prev => prev.filter(member => member.id !== id));

      try {
        const sectionUpdates = prevSections
          .filter(s => s.leadIds.includes(id))
          .map(s =>
            updateSectionInSupabase(s.id, {
              leadIds: s.leadIds.map(leadId =>
                leadId === id ? reassignToId : leadId
              ),
            })
          );
        const documentUpdates = prevDocuments
          .filter(d => d.responsibleId === id)
          .map(d =>
            updateDocumentInSupabase(d.id, { responsibleId: reassignToId })
          );
        const taskUpdates = prevPhases.flatMap(phase =>
          phase.tasks
            .filter(task => task.ownerId === id)
            .map(task =>
              updatePhaseTaskInSupabase(phase.id, task.id, {
                ownerId: reassignToId,
              })
            )
        );

        await Promise.all([...sectionUpdates, ...documentUpdates, ...taskUpdates]);
        const { error } = await deleteTeamMemberInSupabase(id);
        if (error) {
          setSections(prevSections);
          setDocuments(prevDocuments);
          setPhases(prevPhases);
          setTeamMembers(prevMembers);
          return { ok: false, error: error.message };
        }
      } catch {
        setSections(prevSections);
        setDocuments(prevDocuments);
        setPhases(prevPhases);
        setTeamMembers(prevMembers);
        return { ok: false, error: "Failed to remove team member" };
      }

      return { ok: true };
    },
    [sections, documents, phases, teamMembers, validateMemberRemoval]
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
    addTeamMember,
    validateMemberRemoval,
    removeTeamMember,
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
