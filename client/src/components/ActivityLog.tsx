// ACHIEVE-SEA Tracker — Activity Log Component
// Shows recent status changes and updates

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export interface ActivityEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: "status" | "progress" | "assign" | "note" | "doc";
}

const LOG_KEY = "achieve-sea-activity-log";
const MAX_ENTRIES = 50;

export function useActivityLog() {
  const [log, setLog] = useState<ActivityEntry[]>(() => {
    try {
      const raw = localStorage.getItem(LOG_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ActivityEntry[];
        return parsed.map((e) => ({ ...e, timestamp: new Date(e.timestamp) }));
      }
    } catch {}
    return [];
  });

  const addEntry = (message: string, type: ActivityEntry["type"]) => {
    const entry: ActivityEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: new Date(),
      message,
      type,
    };
    setLog((prev) => {
      const updated = [entry, ...prev].slice(0, MAX_ENTRIES);
      localStorage.setItem(LOG_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearLog = () => {
    setLog([]);
    localStorage.removeItem(LOG_KEY);
  };

  return { log, addEntry, clearLog };
}

export function ActivityLogPanel({ log, onClear }: { log: ActivityEntry[]; onClear: () => void }) {
  if (log.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-xs">
        No activity yet. Start updating sections to see changes here.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Activity</span>
        <button
          onClick={onClear}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear
        </button>
      </div>
      {log.map((entry) => (
        <div key={entry.id} className="flex items-start gap-2 py-1.5 border-b border-border last:border-0">
          <Clock className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-foreground leading-relaxed">{entry.message}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {entry.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
