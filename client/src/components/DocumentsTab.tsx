// ACHIEVE-SEA Tracker — 15 Documents Tab
// Design: Neo-Institutional / Data Command Center
// Document status editing, responsible person reassignment

import { FileCheck, FileWarning, FileX, HelpCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useTracker } from "@/contexts/SupabaseTrackerContext";
import { DOC_STATUS_CONFIG, type DocStatus } from "@/lib/data";
import { cn } from "@/lib/utils";
import { DocStatusBadge, MemberPill, TeamMemberSelect } from "./TrackerUI";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const GROUP_LABELS: Record<string, string> = {
  "Letters of Support": "d1,d2,d3a,d3b,d3c,d3d",
  "Research Proposal Attachments": "d4,d5",
  "Management & Timetable": "d6,d7,d8,d9",
  "Budget & MEL": "d10,d11,d12,d13,d14,d15",
};

const DOC_GROUPS = [
  {
    label: "Letters of Support",
    ids: ["d1", "d2", "d3a", "d3b", "d3c", "d3d"],
  },
  { label: "Research Proposal Attachments", ids: ["d4", "d5"] },
  { label: "Management & Timetable", ids: ["d6", "d7", "d8", "d9"] },
  { label: "Budget & MEL", ids: ["d10", "d11", "d12", "d13", "d14", "d15"] },
];

const STATUS_ICONS: Record<DocStatus, React.ReactNode> = {
  missing: <FileX className="w-4 h-4 text-destructive" />,
  unverified: <HelpCircle className="w-4 h-4 text-yellow-600" />,
  verified: <FileCheck className="w-4 h-4 text-green-600" />,
  na: <FileWarning className="w-4 h-4 text-muted-foreground" />,
};

export default function DocumentsTab() {
  const {
    documents = [],
    updateDocStatus,
    updateDocStatusNote,
    updateDocDueDate,
    updateDocResponsible,
  } = useTracker();
  const [draftStatusNotes, setDraftStatusNotes] = useState<Record<string, string>>({});
  const [savingDocId, setSavingDocId] = useState<string | null>(null);

  const getDraftValue = (docId: string, currentValue: string) =>
    Object.prototype.hasOwnProperty.call(draftStatusNotes, docId)
      ? draftStatusNotes[docId]
      : currentValue;

  const isDirty = (docId: string, currentValue: string) =>
    Object.prototype.hasOwnProperty.call(draftStatusNotes, docId) &&
    draftStatusNotes[docId] !== currentValue;

  const onSaveStatusNote = async (docId: string, currentValue: string) => {
    const next = getDraftValue(docId, currentValue);
    if (next === currentValue) return;
    setSavingDocId(docId);
    updateDocStatusNote(docId, next);
    setDraftStatusNotes(prev => {
      const copy = { ...prev };
      delete copy[docId];
      return copy;
    });
    setSavingDocId(null);
  };

  const onCancelStatusNote = (docId: string) => {
    setDraftStatusNotes(prev => {
      const copy = { ...prev };
      delete copy[docId];
      return copy;
    });
  };

  const formatDueDateLabel = (date: Date) =>
    `${date.getDate()} ${date.toLocaleString("en-US", { month: "short" })}`;

  const parseDueDateLabel = (value?: string | null): Date | undefined => {
    if (!value || typeof value !== "string") return undefined;
    const match = value.trim().match(/^(\d{1,2})\s+([A-Za-z]{3,})$/);
    if (!match) return undefined;
    const day = Number(match[1]);
    const month = new Date(`${match[2]} 1, 2026`).getMonth();
    if (Number.isNaN(day) || Number.isNaN(month)) return undefined;
    return new Date(2026, month, day);
  };

  const summary = useMemo(() => {
    const counts: Record<DocStatus, number> = {
      missing: 0,
      unverified: 0,
      verified: 0,
      na: 0,
    };
    (documents || []).forEach(d => counts[d.status]++);
    return counts;
  }, [documents]);

  return (
    <div className="space-y-6 fade-up">
      {/* Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.keys(DOC_STATUS_CONFIG) as DocStatus[]).map(s => {
          const cfg = DOC_STATUS_CONFIG[s];
          return (
            <div
              key={s}
              className="bg-card rounded-lg p-3 border border-border shadow-sm flex items-center gap-3"
              style={{ borderLeftWidth: 3, borderLeftColor: cfg.dot }}
            >
              {STATUS_ICONS[s]}
              <div>
                <p
                  className="text-xl font-bold tabular-nums"
                  style={{ color: cfg.dot }}
                >
                  {summary[s]}
                </p>
                <p className="text-xs text-muted-foreground">{cfg.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Documents Table by Group */}
      {DOC_GROUPS.map(group => {
        const groupDocs = documents.filter(d => group.ids.includes(d.id));
        return (
          <div
            key={group.label}
            className="bg-card rounded-lg border border-border shadow-sm overflow-hidden"
          >
            {/* Group Header */}
            <div className="bg-muted/60 px-4 py-2 border-b border-border">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider w-10">
                    #
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider hidden sm:table-cell w-16">
                    Ref
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider hidden md:table-cell w-36">
                    Responsible
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider w-36">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider hidden lg:table-cell">
                    Notes
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider w-20">
                    Due
                  </th>
                </tr>
              </thead>
              <tbody>
                {groupDocs.map((doc, i) => {
                  const currentDue = doc.dueDate?.trim()
                    ? doc.dueDate
                    : "No due date";
                  return (
                  <tr
                    key={doc.id}
                    className={cn(
                      "border-t border-border hover:bg-muted/30 transition-colors duration-100",
                      doc.status === "missing" && "bg-destructive/5"
                    )}
                  >
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs font-bold text-muted-foreground">
                        {doc.docNum}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 flex-shrink-0">
                          {STATUS_ICONS[doc.status]}
                        </span>
                        <span className="text-xs font-medium leading-relaxed">
                          {doc.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 hidden sm:table-cell">
                      <span className="font-mono text-xs font-bold text-primary">
                        {doc.sectionRef}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 hidden md:table-cell">
                      <TeamMemberSelect
                        selectedIds={[doc.responsibleId]}
                        onChange={ids =>
                          updateDocResponsible(
                            doc.id,
                            ids[0] ?? doc.responsibleId
                          )
                        }
                        multiple={false}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <DocStatusBadge
                        status={doc.status}
                        onChange={s => updateDocStatus(doc.id, s)}
                      />
                    </td>
                    <td className="px-4 py-2.5 hidden lg:table-cell">
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={getDraftValue(doc.id, doc.statusNote)}
                          onChange={e =>
                            setDraftStatusNotes(prev => ({
                              ...prev,
                              [doc.id]: e.target.value,
                            }))
                          }
                          onKeyDown={e => {
                            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                              e.preventDefault();
                              void onSaveStatusNote(doc.id, doc.statusNote);
                            }
                            if (e.key === "Escape") {
                              e.preventDefault();
                              onCancelStatusNote(doc.id);
                            }
                          }}
                          className="w-full text-xs bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none py-0.5 transition-colors duration-150 text-muted-foreground"
                          placeholder="Add note..."
                        />
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => void onSaveStatusNote(doc.id, doc.statusNote)}
                            disabled={!isDirty(doc.id, doc.statusNote) || savingDocId === doc.id}
                            className="rounded bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground disabled:opacity-50"
                          >
                            {savingDocId === doc.id ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={() => onCancelStatusNote(doc.id)}
                            disabled={!isDirty(doc.id, doc.statusNote) || savingDocId === doc.id}
                            className="rounded border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground disabled:opacity-50"
                          >
                            Cancel
                          </button>
                          {isDirty(doc.id, doc.statusNote) && (
                            <span className="text-[10px] text-amber-600 font-medium">
                              Unsaved
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="text-xs font-semibold whitespace-nowrap rounded border border-border px-2 py-0.5 text-muted-foreground"
                          >
                            {currentDue}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <Calendar
                            mode="single"
                            selected={
                              currentDue === "No due date"
                                ? undefined
                                : parseDueDateLabel(currentDue)
                            }
                            onSelect={date => {
                              if (!date) return;
                              const next = formatDueDateLabel(date);
                              if (next === currentDue) return;
                              updateDocDueDate(doc.id, next);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        {(Object.keys(DOC_STATUS_CONFIG) as DocStatus[]).map(s => {
          const cfg = DOC_STATUS_CONFIG[s];
          return (
            <span key={s} className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: cfg.dot }}
              />
              {cfg.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
