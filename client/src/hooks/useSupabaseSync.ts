// Supabase Real-time Sync Hook
// Syncs tracker state across all connected users via Supabase

import { useEffect, useRef } from "react";
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

  useEffect(() => {
    if (!supabase || !enabled) return;

    // Clean up previous subscriptions
    subscriptionsRef.current.forEach((unsub) => unsub());
    subscriptionsRef.current = [];

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

        // Initial fetch
        await fetchAllData();
      } catch (err) {
        console.error("Supabase subscription error:", err);
      }
    };

    const fetchAllData = async () => {
      try {
        const [sectionsRes, docsRes, phasesRes] = await Promise.all([
          supabase.from("sections").select("*"),
          supabase.from("documents").select("*"),
          supabase.from("phases").select("*"),
        ]);

        if (sectionsRes.data && docsRes.data && phasesRes.data) {
          onUpdate({
            sections: sectionsRes.data as Section[],
            documents: docsRes.data as Document[],
            phases: phasesRes.data as Phase[],
            lastUpdated: Date.now(),
          });
        }
      } catch (err) {
        console.error("Supabase fetch error:", err);
      }
    };

    setupSubscriptions();

    return () => {
      subscriptionsRef.current.forEach((unsub) => unsub());
      subscriptionsRef.current = [];
    };
  }, [onUpdate, enabled]);
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
