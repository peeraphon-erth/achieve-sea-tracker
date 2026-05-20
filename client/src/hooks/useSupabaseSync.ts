// Supabase Real-time Sync Hook
// Syncs tracker state across all connected users via Supabase

import { useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Document, Phase, Section, TeamMember } from "@/lib/data";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

let supabase: any = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export interface SyncState {
  sections: Section[];
  documents: Document[];
  phases: Phase[];
  teamMembers: TeamMember[];
  lastUpdated: number;
}

export function useSupabaseSync(
  onUpdate: (state: SyncState) => void,
  enabled: boolean = true
) {
  const subscriptionsRef = useRef<Array<() => void>>([]);
  const onUpdateRef = useRef(onUpdate);

  // Keep onUpdate ref in sync
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (!supabase || !enabled) return;

    let isMounted = true;

    // Clean up previous subscriptions
    subscriptionsRef.current.forEach((unsub) => unsub());
    subscriptionsRef.current = [];

    const normalizeSections = (sections: any[]): any[] => {
      return (sections || []).map((row: any) => {
        const normalized = {
          ...row,
          leadIds: row.leadIds ?? row.leadids ?? [],
          dueDate: row.dueDate ?? row.duedate ?? "",
          roleNote: row.roleNote ?? row.rolenote ?? "",
        };

        if (typeof normalized.leadIds === "string") {
          try {
            normalized.leadIds = JSON.parse(normalized.leadIds);
          } catch {
            normalized.leadIds = [];
          }
        }
        if (!Array.isArray(normalized.leadIds)) {
          normalized.leadIds = [];
        }

        return normalized;
      });
    };

    const normalizeDocuments = (documents: any[]): any[] => {
      return (documents || []).map((row: any) => ({
        ...row,
        docNum: row.docNum ?? row.docnum ?? "",
        sectionRef: row.sectionRef ?? row.sectionref ?? "",
        responsibleId: row.responsibleId ?? row.responsibleid ?? "",
        statusNote: row.statusNote ?? row.statusnote ?? "",
        dueDate: row.dueDate ?? row.duedate ?? "",
      }));
    };

    // Normalize and sort phases
    const normalizePhases = (phases: any[]): any[] => {
      const phaseOrder: Record<string, number> = {
        p1: 1,
        p2a: 2,
        p2b: 3,
        p3: 4,
        p4: 5,
        p5: 6,
        p6: 7,
        p7: 8,
      };

      return (phases || []).map((phase: any) => {
        const normalized = { ...phase };
        if (normalized.tasks && typeof normalized.tasks === 'string') {
          try {
            normalized.tasks = JSON.parse(normalized.tasks);
          } catch {
            normalized.tasks = [];
          }
        }
        if (!Array.isArray(normalized.tasks)) {
          normalized.tasks = [];
        }
        return normalized;
      }).sort((a: any, b: any) => {
        const orderA = phaseOrder[a.id] ?? Number.MAX_SAFE_INTEGER;
        const orderB = phaseOrder[b.id] ?? Number.MAX_SAFE_INTEGER;
        if (orderA !== orderB) return orderA - orderB;
        return String(a.id).localeCompare(String(b.id));
      });
    };

    const fetchAllData = async () => {
      try {
        const [sectionsRes, docsRes, phasesRes, membersRes] = await Promise.all([
          supabase.from("sections").select("*"),
          supabase.from("documents").select("*"),
          supabase.from("phases").select("*"),
          supabase.from("team_members").select("*"),
        ]);

        if (
          isMounted &&
          sectionsRes.data &&
          docsRes.data &&
          phasesRes.data &&
          membersRes.data
        ) {
          onUpdateRef.current({
            sections: normalizeSections(sectionsRes.data) as Section[],
            documents: normalizeDocuments(docsRes.data) as Document[],
            phases: normalizePhases(phasesRes.data) as Phase[],
            teamMembers: membersRes.data as TeamMember[],
            lastUpdated: Date.now(),
          });
        }
      } catch (err) {
        console.error("Supabase fetch error:", err);
      }
    };

    const setupSubscriptions = async () => {
      try {
        // Subscribe to sections changes
        const sectionsChannel = supabase
          .channel("sections")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "sections" },
            () => fetchAllData()
          )
          .subscribe();

        // Subscribe to documents changes
        const docsChannel = supabase
          .channel("documents")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "documents" },
            () => fetchAllData()
          )
          .subscribe();

        // Subscribe to phases changes
        const phasesChannel = supabase
          .channel("phases")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "phases" },
            () => fetchAllData()
          )
          .subscribe();

        const teamMembersChannel = supabase
          .channel("team_members")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "team_members" },
            () => fetchAllData()
          )
          .subscribe();

        subscriptionsRef.current = [
          () => supabase.removeChannel(sectionsChannel),
          () => supabase.removeChannel(docsChannel),
          () => supabase.removeChannel(phasesChannel),
          () => supabase.removeChannel(teamMembersChannel),
        ];

        // Initial fetch - CRITICAL: This loads data from Supabase on mount
        await fetchAllData();
      } catch (err) {
        console.error("Supabase subscription error:", err);
      }
    };

    setupSubscriptions();

    return () => {
      isMounted = false;
      subscriptionsRef.current.forEach((unsub) => unsub());
      subscriptionsRef.current = [];
    };
  }, [enabled]);
}

export async function updateSectionInSupabase(
  id: string,
  updates: Record<string, any>
) {
  if (!supabase) return;
  const { error } = await supabase
    .from("sections")
    .update(updates)
    .eq("id", id);
  if (error) console.error("Update section error:", error);
}

export async function updateDocumentInSupabase(
  id: string,
  updates: Record<string, any>
) {
  if (!supabase) return;
  const { error } = await supabase
    .from("documents")
    .update(updates)
    .eq("id", id);
  if (error) console.error("Update document error:", error);
}

export async function updatePhaseTaskInSupabase(
  phaseId: string,
  taskId: string,
  updates: { done?: boolean; ownerId?: string; dueDate?: string }
) {
  if (!supabase) return;
  
  // Fetch current phase
  const { data: phase } = await supabase
    .from("phases")
    .select("tasks")
    .eq("id", phaseId)
    .single();

  if (!phase) return;

  // Update the specific task
  const updatedTasks = (phase as any).tasks.map((t: any) =>
    t.id === taskId ? { ...t, ...updates } : t
  );

  const { error } = await supabase
    .from("phases")
    .update({ tasks: updatedTasks })
    .eq("id", phaseId);

  if (error) console.error("Update phase task error:", error);
}

export async function insertTeamMemberInSupabase(member: TeamMember) {
  if (!supabase) return { error: null };
  const { error } = await supabase.from("team_members").insert(member);
  if (error) console.error("Insert team member error:", error);
  return { error };
}

export async function updateTeamMemberInSupabase(
  id: string,
  updates: Partial<Omit<TeamMember, "id">>
) {
  if (!supabase) return { error: null };
  const { error } = await supabase
    .from("team_members")
    .update(updates)
    .eq("id", id);
  if (error) console.error("Update team member error:", error);
  return { error };
}

export async function deleteTeamMemberInSupabase(id: string) {
  if (!supabase) return { error: null };
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) console.error("Delete team member error:", error);
  return { error };
}

export function isSupabaseConfigured(): boolean {
  return !!supabaseUrl && !!supabaseKey;
}
