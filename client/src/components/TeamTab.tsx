// ACHIEVE-SEA Tracker — Team Tab
// Design: Neo-Institutional / Data Command Center
// Team member cards with assigned sections, workload, and quick reassignment

import { useMemo } from "react";
import { useTracker } from "@/contexts/SupabaseTrackerContext";
import { ORG_CONFIG, STATUS_CONFIG, type OrgId } from "@/lib/data";
import { ProgressRing } from "./TrackerUI";

const ORG_ORDER: OrgId[] = ["kmitl", "erth", "ait", "recyglo", "uplb"];

export default function TeamTab() {
  const {
    sections = [],
    documents = [],
    phases = [],
    teamMembers = [],
    updateTeamMember,
  } = useTracker();

  const memberStats = useMemo(() => {
    return teamMembers.map(member => {
      const ownedSections = (sections || []).filter(s =>
        s?.leadIds?.includes(member.id)
      );
      const ownedDocs = (documents || []).filter(
        d => d?.responsibleId === member.id
      );
      const ownedTasks = (phases || []).flatMap(p =>
        (p?.tasks || [])
          .filter(t => t?.ownerId === member.id)
          .map(t => ({
            ...t,
            phaseId: p.id,
            phaseName: p.name,
            phaseColor: p.color,
          }))
      );
      const completedTasks = ownedTasks.filter(t => t?.done).length;
      const avgProgress = ownedSections.length
        ? Math.round(
            ownedSections.reduce((a, s) => a + s.progress, 0) /
              ownedSections.length
          )
        : 0;

      return {
        member,
        ownedSections,
        ownedDocs,
        ownedTasks,
        completedTasks,
        avgProgress,
      };
    });
  }, [sections, documents, phases, teamMembers]);

  const orgGroups = useMemo(() => {
    return ORG_ORDER.map(org => ({
      org,
      cfg: ORG_CONFIG[org],
      members: memberStats.filter(ms => ms.member.org === org),
    }));
  }, [memberStats]);

  return (
    <div className="space-y-8 fade-up">
      {orgGroups.map(({ org, cfg, members }) => (
        <div key={org}>
          {/* Org Header */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ background: cfg.color }}
            />
            <h2
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: cfg.textColor }}
            >
              {cfg.label}
            </h2>
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">
              {members.length} member{members.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Member Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {members.map(
              ({
                member,
                ownedSections,
                ownedDocs,
                ownedTasks,
                completedTasks,
                avgProgress,
              }) => (
                <div
                  key={member.id}
                  className="bg-card rounded-lg border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  {/* Card Header */}
                  <div
                    className="px-4 py-3 flex items-center gap-3"
                    style={{
                      background: cfg.bg,
                      borderBottom: `1px solid ${cfg.color}30`,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm"
                      style={{ background: cfg.color }}
                    >
                      {member.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <input
                        value={member.name}
                        onChange={e =>
                          updateTeamMember(member.id, { name: e.target.value })
                        }
                        className="w-full bg-transparent text-sm font-bold truncate focus:outline-none"
                        style={{ color: cfg.textColor }}
                      />
                      <input
                        value={member.role}
                        onChange={e =>
                          updateTeamMember(member.id, { role: e.target.value })
                        }
                        className="w-full bg-transparent text-xs text-muted-foreground truncate focus:outline-none"
                      />
                    </div>
                    <ProgressRing
                      value={avgProgress}
                      size={40}
                      strokeWidth={3.5}
                      color={cfg.color}
                    />
                  </div>

                  <div className="px-4 py-2 border-b border-border bg-muted/20 grid grid-cols-2 gap-2">
                    <input
                      value={member.initials}
                      onChange={e =>
                        updateTeamMember(member.id, {
                          initials: e.target.value.slice(0, 4).toUpperCase(),
                        })
                      }
                      className="w-full rounded border border-border bg-background px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-ring"
                      placeholder="Initials"
                    />
                    <select
                      value={member.org}
                      onChange={e =>
                        updateTeamMember(member.id, {
                          org: e.target.value as OrgId,
                        })
                      }
                      className="w-full rounded border border-border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      {ORG_ORDER.map(orgId => (
                        <option key={orgId} value={orgId}>
                          {orgId.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
                    <div className="px-3 py-2 text-center">
                      <p
                        className="text-lg font-bold tabular-nums"
                        style={{ color: cfg.color }}
                      >
                        {ownedSections.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Sections</p>
                    </div>
                    <div className="px-3 py-2 text-center">
                      <p
                        className="text-lg font-bold tabular-nums"
                        style={{ color: cfg.color }}
                      >
                        {ownedDocs.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Docs</p>
                    </div>
                    <div className="px-3 py-2 text-center">
                      <p
                        className="text-lg font-bold tabular-nums"
                        style={{ color: cfg.color }}
                      >
                        {completedTasks}/{ownedTasks.length}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Tasks Done
                      </p>
                    </div>
                  </div>

                  {/* Sections List */}
                  {ownedSections.length > 0 && (
                    <div className="px-4 py-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Assigned Sections
                      </p>
                      <div className="space-y-1.5">
                        {ownedSections.slice(0, 5).map(s => {
                          const stCfg = STATUS_CONFIG[s.status];
                          return (
                            <div key={s.id} className="flex items-center gap-2">
                              <span
                                className="font-mono text-xs font-bold w-7 flex-shrink-0"
                                style={{ color: cfg.color }}
                              >
                                {s.num}
                              </span>
                              <span className="text-xs text-foreground flex-1 truncate">
                                {s.title}
                              </span>
                              <span
                                className="flex-shrink-0 w-2 h-2 rounded-full"
                                style={{ background: stCfg.dot }}
                                title={stCfg.label}
                              />
                            </div>
                          );
                        })}
                        {ownedSections.length > 5 && (
                          <p className="text-xs text-muted-foreground">
                            +{ownedSections.length - 5} more sections
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Timeline Tasks */}
                  {ownedTasks.length > 0 && (
                    <div className="px-4 py-3 border-t border-border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Timeline Tasks
                      </p>
                      <div className="space-y-1">
                        {ownedTasks.slice(0, 3).map(task => (
                          <div key={task.id} className="flex items-start gap-2">
                            <span
                              className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{
                                background: task.done
                                  ? "#22C55E"
                                  : task.phaseColor,
                              }}
                            />
                            <span
                              className={`text-xs leading-relaxed ${task.done ? "line-through text-muted-foreground" : ""}`}
                            >
                              {task.text.length > 60
                                ? task.text.slice(0, 60) + "…"
                                : task.text}
                            </span>
                          </div>
                        ))}
                        {ownedTasks.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{ownedTasks.length - 3} more tasks
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {ownedSections.length === 0 && ownedTasks.length === 0 && (
                    <div className="px-4 py-4 text-center text-xs text-muted-foreground">
                      No sections or tasks assigned yet.
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
