// Cross-browser localStorage sync hook
// Syncs state changes across tabs/windows in the same browser via storage events

import { useEffect } from "react";
import type { Document, Phase, Section } from "@/lib/data";

export interface CrossBrowserSyncState {
  sections: Section[];
  documents: Document[];
  phases: Phase[];
}

const STORAGE_KEY = "achieve-sea-tracker-v1";

export function useCrossBrowserSync(
  onUpdate: (state: CrossBrowserSyncState) => void
) {
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // Only respond to changes from OTHER tabs/windows
      if (event.key?.startsWith(STORAGE_KEY) && event.newValue) {
        try {
          // Reconstruct full state from all storage keys
          const sections = JSON.parse(
            localStorage.getItem(`${STORAGE_KEY}-sections`) || "[]"
          );
          const documents = JSON.parse(
            localStorage.getItem(`${STORAGE_KEY}-documents`) || "[]"
          );
          const phases = JSON.parse(
            localStorage.getItem(`${STORAGE_KEY}-phases`) || "[]"
          );

          onUpdate({ sections, documents, phases });
        } catch (err) {
          console.error("Cross-browser sync error:", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [onUpdate]);
}

export function validateSupabaseConfig(): {
  isConfigured: boolean;
  url: string;
  key: string;
} {
  const url = import.meta.env.VITE_SUPABASE_URL || "";
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
  const isConfigured = !!(url && key && url.includes("supabase.co"));
  return { isConfigured, url, key };
}
