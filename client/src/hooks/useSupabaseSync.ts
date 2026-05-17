// Supabase Real-time Sync Hook
// Syncs tracker state across all connected users via Supabase

import { useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Document, Phase, Section } from "@/lib/data";

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

    // Normalize data from Supabase (convert strings to arrays/objects if needed)
    const normalizeData = (data: any): any => {
      if (!data) return data;
      
      // For sections: ensure leadIds is an array
      if (Array.isArray(data)) {
        return data.map((item: any) => {
          const normalized = { ...item };
          if (normalized.leadIds && typeof normalized.leadIds === 'string') {
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
      }
      return data;
    };

    // Normalize phase tasks
    const normalizePhases = (phases: any[]): any[] => {
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
      });
    };

    const fetchAllData = async () => {
      try {
        const [sectionsRes, docsRes, phasesRes] = await Promise.all([
          supabase.from("sections").select("*"),
          supabase.from("documents").select("*"),
          supabase.from("phases").select("*"),
        ]);

        if (isMounted && sectionsRes.data && docsRes.data && phasesRes.data) {
          onUpdateRef.current({
            sections: normalizeData(sectionsRes.data) as Section[],
            documents: normalizeData(docsRes.data) as Document[],
            phases: normalizePhases(phasesRes.data) as Phase[],
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

        subscriptionsRef.current = [
          () => supabase.removeChannel(sectionsChannel),
          () => supabase.removeChannel(docsChannel),
          () => supabase.removeChannel(phasesChannel),
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
  updates: { done?: boolean; ownerId?: string }
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

export function isSupabaseConfigured(): boolean {
  return !!supabaseUrl && !!supabaseKey;
}
