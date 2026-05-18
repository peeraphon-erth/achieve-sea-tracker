// ACHIEVE-SEA Tracker — Overview Tab
// Design: Neo-Institutional / Data Command Center
// Stats cards, org summary, ownership matrix

import { AlertTriangle, CheckCircle2, Clock, FileText } from "lucide-react";
import { useMemo } from "react";
import { useTracker } from "@/contexts/SupabaseTrackerContext";
import { ORG_CONFIG, STATUS_CONFIG, type OrgId } from "@/lib/data";
import { MemberPill, ProgressBar, ProgressRing } from "./TrackerUI";

export default function OverviewTab() {
  const { sections = [], documents = [], teamMembers = [] } = useTracker();

  const stats = useMemo(() => {
    const total = sections?.length || 0;
    const complete = sections?.filter(s => s.status === "complete").length || 0;
    const inProgress =
      sections?.filter(s => s.status === "in_progress").length || 0;
    const blocked = sections?.filter(s => s.status === "blocked").length || 0;
    const avgProgress =
      total > 0
        ? Math.round(
            (sections?.reduce((a, s) => a + s.progress, 0) || 0) / total
          )
        : 0;

    const docsTotal = documents?.length || 0;
    const docsMissing =
      documents?.filter(d => d.status === "missing").length || 0;
    const docsVerified =
      documents?.filter(d => d.status === "verified").length || 0;

    return {
      total,
      complete,
      inProgress,
      blocked,
      avgProgress,
      docsTotal,
      docsMissing,
      docsVerified,
    };
  }, [sections, documents]);

  // Org breakdown
  const orgStats = useMemo(() => {
    if (!sections || sections.length === 0) return [];

    const orgs: OrgId[] = ["kmitl", "erth", "recyglo", "ait", "pnc", "uplb"];
    return orgs.map(org => {
      const members = teamMembers.filter(m => m.org === org);
      const memberIds = members.map(m => m.id);
      const ownedSections = (sections || []).filter(s =>
        s?.leadIds?.some?.(id => memberIds.includes(id))
      );
      const done = ownedSections.filter(s => s.status === "complete").length;
      const cfg = ORG_CONFIG[org];
      return { org, cfg, members, ownedSections, done };
    });
  }, [sections, teamMembers]);

  // Deadline countdown
  const deadline = new Date("2026-07-10T23:59:59");
  const now = new Date();
  const daysLeft = Math.max(
    0,
    Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="space-y-6 fade-up">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Overall Progress */}
        <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Overall Progress
              </p>
              <p className="text-2xl font-bold text-primary mt-1">
                {stats.avgProgress}%
              </p>
            </div>
            <ProgressRing value={stats.avgProgress} size={48} />
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.complete} of {stats.total} sections complete
          </p>
        </div>

        {/* In Progress */}
        <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                In Progress
              </p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {stats.inProgress}
              </p>
            </div>
            <Clock className="w-6 h-6 text-green-600 opacity-20" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Sections actively being worked
          </p>
        </div>

        {/* Blocked */}
        <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Blocked
              </p>
              <p className="text-2xl font-bold text-destructive mt-1">
                {stats.blocked}
              </p>
            </div>
            <AlertTriangle className="w-6 h-6 text-destructive opacity-20" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Sections needing attention
          </p>
        </div>

        {/* Documents */}
        <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Documents
              </p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {stats.docsVerified}/{stats.docsTotal}
              </p>
            </div>
            <FileText className="w-6 h-6 text-blue-600 opacity-20" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {stats.docsMissing} missing or action required
          </p>
        </div>
      </div>

      {/* Deadline Banner */}
      <div
        className="rounded-lg px-5 py-4 flex items-center gap-4 border"
        style={{
          background:
            daysLeft <= 7 ? "#FEE2E2" : daysLeft <= 14 ? "#FEF9C3" : "#EBF5FB",
          borderColor:
            daysLeft <= 7 ? "#FCA5A5" : daysLeft <= 14 ? "#FDE68A" : "#BFDBFE",
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white text-sm"
          style={{
            background:
              daysLeft <= 7
                ? "#C0392B"
                : daysLeft <= 14
                  ? "#D97706"
                  : "#2E75B6",
          }}
        >
          {daysLeft}d
        </div>
        <div>
          <p
            className="text-sm font-bold"
            style={{
              color:
                daysLeft <= 7
                  ? "#C0392B"
                  : daysLeft <= 14
                    ? "#92400E"
                    : "#1A5C94",
            }}
          >
            {daysLeft <= 7 ? "⚠ URGENT — " : ""}
            {daysLeft} days until portal deadline (10 July 2026)
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: daysLeft <= 7 ? "#991B1B" : "#596367" }}
          >
            Application ID: IA-0000000489 &nbsp;·&nbsp; DREAM 4 Health 2026
            &nbsp;·&nbsp; USD 6,250,000 / 60 months
          </p>
        </div>
        <div className="ml-auto hidden sm:block">
          <div className="text-right">
            <p className="text-xs font-semibold text-muted-foreground">
              Target Submit
            </p>
            <p className="text-sm font-bold text-foreground">9 Jul 2026</p>
          </div>
        </div>
      </div>

      {/* Org Breakdown */}
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Team Workload by Organisation
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {Array.isArray(orgStats) && orgStats.length > 0 ? (
            orgStats.map(({ org, cfg, members, ownedSections, done }) => (
              <div
                key={org}
                className="bg-card rounded-lg p-4 border border-border shadow-sm hover:shadow-md transition-shadow duration-200"
                style={{ borderTopWidth: 3, borderTopColor: cfg.color }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: cfg.textColor }}
                    >
                      {org.toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {cfg.label}
                    </p>
                  </div>
                  <ProgressRing
                    value={
                      ownedSections.length > 0
                        ? Math.round((done / ownedSections.length) * 100)
                        : 0
                    }
                    size={40}
                  />
                </div>
                <div className="mb-3">
                  <p className="text-2xl font-bold text-foreground">
                    {ownedSections.length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    sections assigned
                  </p>
                </div>
                <div className="space-y-1">
                  {members.map(m => (
                    <MemberPill key={m.id} memberId={m.id} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground text-sm">
              Loading organisation data...
            </div>
          )}
        </div>
      </div>

      {/* Section Ownership Matrix */}
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Section Ownership Matrix
        </h2>
        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider w-12">
                  #
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider">
                  Section
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider">
                  Lead Drafter(s)
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider w-24">
                  Due
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider w-32">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(sections) && sections.length > 0 ? (
                sections.slice(0, 5).map(s => (
                  <tr
                    key={s.id}
                    className="border-t border-border hover:bg-muted/40 transition-colors"
                  >
                    <td className="px-4 py-2.5">
                      <span className="text-xs font-mono font-bold text-muted-foreground">
                        {s.num}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs font-medium">{s.title}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {s.leadIds.map(id => (
                          <MemberPill key={id} memberId={id} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <p className="text-xs text-muted-foreground">
                        {s.roleNote}
                      </p>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs font-semibold text-destructive">
                        {s.dueDate}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="inline-block px-2 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: STATUS_CONFIG[s.status]?.bg,
                          color: STATUS_CONFIG[s.status]?.color,
                        }}
                      >
                        {STATUS_CONFIG[s.status]?.label}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground text-sm"
                  >
                    Loading sections...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
