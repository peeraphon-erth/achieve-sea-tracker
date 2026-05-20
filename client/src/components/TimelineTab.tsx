// ACHIEVE-SEA Tracker — Timeline Tab
// Design: Neo-Institutional / Data Command Center
// 7-phase timeline with task completion checkboxes and reassignment

import { CheckSquare2, Square } from "lucide-react";
import { useTracker } from "@/contexts/SupabaseTrackerContext";
import { ORG_CONFIG } from "@/lib/data";
import { cn } from "@/lib/utils";
import { MemberPill, TeamMemberSelect } from "./TrackerUI";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function TimelineTab() {
  const {
    phases = [],
    teamMembers = [],
    togglePhaseTask,
    reassignPhaseTask,
    updatePhaseTaskDueDate,
  } = useTracker();

  const formatDueDateLabel = (date: Date) =>
    `${date.getDate()} ${date.toLocaleString("en-US", { month: "short" })}`;

  const parseDueDateLabel = (value?: string | null): Date | undefined => {
    if (!value || typeof value !== "string") return undefined;
    if (value === "No due date") return undefined;
    const match = value.trim().match(/^(\d{1,2})\s+([A-Za-z]{3,})$/);
    if (!match) return undefined;
    const day = Number(match[1]);
    const month = new Date(`${match[2]} 1, 2026`).getMonth();
    if (Number.isNaN(day) || Number.isNaN(month)) return undefined;
    return new Date(2026, month, day);
  };

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

  const sortedPhases = [...(phases || [])].sort((a, b) => {
    const orderA = phaseOrder[a.id] ?? Number.MAX_SAFE_INTEGER;
    const orderB = phaseOrder[b.id] ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return a.id.localeCompare(b.id);
  });

  return (
    <div className="space-y-4 fade-up">
      <div className="flex items-center gap-2 mb-2">
        <p className="text-xs text-muted-foreground">
          Check tasks as complete. Click assignee pills to reassign.
        </p>
      </div>

      {sortedPhases.map((phase, phaseIdx) => {
        const doneTasks = (phase?.tasks || []).filter(t => t?.done).length;
        const totalTasks = phase?.tasks?.length || 0;
        const pct = Math.round((doneTasks / totalTasks) * 100);

        return (
          <div
            key={phase.id}
            className="bg-card rounded-lg border border-border shadow-sm overflow-hidden fade-up"
            style={{ animationDelay: `${phaseIdx * 60}ms` }}
          >
            {/* Phase Header */}
            <div
              className="flex items-center gap-4 px-5 py-3"
              style={{ background: phase.color }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                    {phase.num}
                  </span>
                  <span className="text-base font-bold text-white">
                    {phase.dates}
                  </span>
                  <span className="text-sm text-white/80">{phase.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Progress bar */}
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-white/90 tabular-nums w-8">
                    {pct}%
                  </span>
                </div>
                <span className="text-xs font-semibold text-white/80 tabular-nums">
                  {doneTasks}/{totalTasks}
                </span>
              </div>
            </div>

            {/* Tasks */}
            <div className="divide-y divide-border">
              {phase.tasks.map(task => {
                const currentDue = task.dueDate || "No due date";
                const member = teamMembers.find(m => m.id === task.ownerId);
                const orgCfg = member
                  ? ORG_CONFIG[member.org]
                  : { color: "#596367", bg: "#F4F6F7", textColor: "#596367" };

                return (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-start gap-3 px-5 py-3 transition-colors duration-100",
                      task.done ? "bg-muted/30" : "hover:bg-muted/20"
                    )}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => togglePhaseTask(phase.id, task.id)}
                      className="mt-0.5 flex-shrink-0 transition-all duration-150 hover:opacity-70 active:scale-90"
                      style={{ color: task.done ? "#22C55E" : "#9CA3AF" }}
                    >
                      {task.done ? (
                        <CheckSquare2 className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>

                    {/* Assignee */}
                    <div className="flex-shrink-0 mt-0.5">
                      <TeamMemberSelect
                        selectedIds={[task.ownerId]}
                        onChange={ids =>
                          reassignPhaseTask(
                            phase.id,
                            task.id,
                            ids[0] ?? task.ownerId
                          )
                        }
                        multiple={false}
                      />
                    </div>

                    {/* Task text */}
                    <div className="flex-1 pt-0.5 flex items-center gap-2 min-w-0">
                      <p
                        className={cn(
                          "text-xs leading-relaxed flex-1 min-w-0",
                          task.done
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        )}
                      >
                        {task.text}
                      </p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="rounded border border-border bg-background px-2 py-0.5 text-[11px] font-semibold text-muted-foreground whitespace-nowrap"
                            >
                              {currentDue}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={parseDueDateLabel(currentDue)}
                              onSelect={date => {
                                if (!date) return;
                                const next = formatDueDateLabel(date);
                                if (next === currentDue) return;
                                updatePhaseTaskDueDate(phase.id, task.id, next);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Deadline reminder */}
      <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-5 py-4 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-destructive animate-pulse flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-destructive">
            Portal Deadline: 10 July 2026
          </p>
          <p className="text-xs text-destructive/80 mt-0.5">
            Target submission by 9 July to maintain a 24-hour buffer. RO
            approval (Phase 6) is the critical path dependency.
          </p>
        </div>
      </div>
    </div>
  );
}
