// ACHIEVE-SEA Tracker — All 19 Sections Tab
// Design: Neo-Institutional / Data Command Center
// Inline status editing, progress update, task reassignment

import { ChevronDown, ChevronRight, MessageSquare } from "lucide-react";
import { Fragment, useState, useMemo } from "react";
import { useTracker } from "@/contexts/SupabaseTrackerContext";
import { ORG_CONFIG, STATUS_CONFIG, TEAM_MEMBERS, type OrgId } from "@/lib/data";
import { SECTION_INSTRUCTIONS } from "@/lib/section-instructions";
import { cn } from "@/lib/utils";
import {
  MemberPill,
  ProgressEditor,
  StatusBadge,
  TeamMemberSelect,
} from "./TrackerUI";

type FilterKey = "all" | "not_started" | "in_progress" | "review" | "blocked" | "complete" | OrgId;

export default function SectionsTab() {
  const { sections = [], updateSectionStatus, updateSectionProgress, updateSectionLeads, updateSectionNotes } = useTracker();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = useMemo(() => {
    let result = filter === "all" ? sections : (sections || []).filter((s) => {
      if (["blocked", "in_progress", "review", "complete", "not_started"].includes(filter)) {
        return s.status === filter;
      }
      // filter by org
      const memberIds = TEAM_MEMBERS.filter((m) => m.org === filter as OrgId).map((m) => m.id);
      return s.leadIds.some((id) => memberIds.includes(id));
    });
    
    // Sort by section number (S1, S2, ... S19) to maintain consistent order
    return result.sort((a, b) => {
      const numA = parseInt(a.num.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.num.replace(/\D/g, '')) || 0;
      return numA - numB;
    });
  }, [sections, filter]);

  return (
    <div className="space-y-4 fade-up">
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1">Filter:</span>
        {[
          { key: "all" as FilterKey, label: "All" },
          { key: "not_started" as FilterKey, label: "Not Started" },
          { key: "in_progress" as FilterKey, label: "In Progress" },
          { key: "review" as FilterKey, label: "Review" },
          { key: "blocked" as FilterKey, label: "Blocked" },
          { key: "complete" as FilterKey, label: "Complete" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150",
              filter === key
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:bg-accent"
            )}
          >
            {label}
          </button>
        ))}
        <div className="w-px h-4 bg-border mx-1" />
        {(["kmitl", "erth", "ait", "recyglo", "uplb"] as OrgId[]).map((org) => {
          const cfg = ORG_CONFIG[org];
          return (
            <button
              key={org}
              onClick={() => setFilter(org)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 border",
                filter === org ? "border-transparent" : "border-border bg-card text-muted-foreground hover:bg-accent"
              )}
              style={filter === org ? { background: cfg.bg, color: cfg.textColor, borderColor: cfg.color } : undefined}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
              {org.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {sections.length} sections
        {filter !== "all" && ` · filtered by "${filter}"`}
      </p>

      {/* Sections Table */}
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="px-3 py-2.5 w-10"></th>
              <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider w-12">#</th>
              <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider">Section Title</th>
              <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider hidden md:table-cell w-48">Lead Drafter(s)</th>
              <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider w-24">Due</th>
              <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider w-36">Status</th>
              <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider w-40 hidden lg:table-cell">Progress</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const isExpanded = expanded === s.id;
              const statusCfg = STATUS_CONFIG[s.status];

              // Determine primary org color from first lead
              const firstLead = TEAM_MEMBERS.find((m) => m.id === s.leadIds[0]);
              const orgColor = firstLead ? ORG_CONFIG[firstLead.org].color : "#596367";

              return (
                <Fragment key={s.id}>
                  <tr
                    className={cn(
                      "border-t border-border transition-colors duration-100 cursor-pointer",
                      isExpanded ? "bg-accent/50" : "hover:bg-muted/40"
                    )}
                    onClick={() => setExpanded(isExpanded ? null : s.id)}
                  >
                    <td className="px-3 py-2.5 text-center">
                      {isExpanded
                        ? <ChevronDown className="w-4 h-4 text-muted-foreground mx-auto" />
                        : <ChevronRight className="w-4 h-4 text-muted-foreground mx-auto" />
                      }
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs font-bold" style={{ color: orgColor }}>{s.num}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs font-medium">{s.title}</span>
                    </td>
                    <td className="px-4 py-2.5 hidden md:table-cell" onClick={(e) => e.stopPropagation()}>
                      <TeamMemberSelect
                        selectedIds={s.leadIds}
                        onChange={(ids) => updateSectionLeads(s.id, ids)}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs font-semibold text-destructive whitespace-nowrap">{s.dueDate}</span>
                    </td>
                    <td className="px-4 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <StatusBadge
                        status={s.status}
                        onChange={(st) => updateSectionStatus(s.id, st)}
                        compact
                      />
                    </td>
                    <td className="px-4 py-2.5 hidden lg:table-cell" onClick={(e) => e.stopPropagation()}>
                      <ProgressEditor
                        value={s.progress}
                        onChange={(v) => updateSectionProgress(s.id, v)}
                        color={orgColor}
                      />
                    </td>
                  </tr>

                  {/* Expanded Row */}
                  {isExpanded && (
                    <tr className="border-t border-border bg-accent/20">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Left: Details */}
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Section Instructions</p>
                              <p className="text-xs text-foreground leading-relaxed bg-muted/50 rounded px-3 py-2 max-h-40 overflow-y-auto">
                                {SECTION_INSTRUCTIONS[s.id] || s.roleNote}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Lead Drafter(s) — click to reassign</p>
                              <div className="flex flex-wrap gap-1.5">
                                {s.leadIds.map((id) => <MemberPill key={id} memberId={id} />)}
                              </div>
                              <div className="mt-2">
                                <TeamMemberSelect
                                  selectedIds={s.leadIds}
                                  onChange={(ids) => updateSectionLeads(s.id, ids)}
                                />
                              </div>
                            </div>
                            <div className="md:hidden">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Progress</p>
                              <ProgressEditor
                                value={s.progress}
                                onChange={(v) => updateSectionProgress(s.id, v)}
                                color={orgColor}
                              />
                            </div>
                          </div>

                          {/* Right: Notes + Status */}
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                              <StatusBadge
                                status={s.status}
                                onChange={(st) => updateSectionStatus(s.id, st)}
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <MessageSquare className="w-3 h-3 text-muted-foreground" />
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notes & Updates</p>
                              </div>
                              <textarea
                                value={s.notes}
                                onChange={(e) => updateSectionNotes(s.id, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                placeholder="Add notes, blockers, or updates…"
                                className="w-full h-24 text-xs rounded-md border border-border bg-background px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No sections match the selected filter.
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Click any row to expand details and edit notes. Click status badges or assignees to update inline. All changes are saved automatically.
      </p>
    </div>
  );
}
