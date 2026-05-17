// ACHIEVE-SEA Tracker — Overview Tab
// Design: Neo-Institutional / Data Command Center
// Stats cards, org summary, ownership matrix

import { AlertTriangle, CheckCircle2, Clock, FileText } from "lucide-react";
import { useMemo } from "react";
import { useTracker } from "@/contexts/SupabaseTrackerContext";
import { ORG_CONFIG, STATUS_CONFIG, TEAM_MEMBERS, type OrgId } from "@/lib/data";
import { MemberPill, ProgressBar, ProgressRing } from "./TrackerUI";

export default function OverviewTab() {
  const { sections, documents } = useTracker();

  const stats = useMemo(() => {
    const total = sections.length;
    const complete = sections.filter((s) => s.status === "complete").length;
    const inProgress = sections.filter((s) => s.status === "in_progress").length;
    const blocked = sections.filter((s) => s.status === "blocked").length;
    const avgProgress = Math.round(sections.reduce((a, s) => a + s.progress, 0) / total);

    const docsTotal = documents.length;
    const docsMissing = documents.filter((d) => d.status === "missing").length;
    const docsVerified = documents.filter((d) => d.status === "verified").length;

    return { total, complete, inProgress, blocked, avgProgress, docsTotal, docsMissing, docsVerified };
  }, [sections, documents]);

  // Org breakdown
  const orgStats = useMemo(() => {
    const orgs: OrgId[] = ["kmitl", "erth", "ait", "recyglo", "uplb"];
    return orgs.map((org) => {
      const members = TEAM_MEMBERS.filter((m) => m.org === org);
      const memberIds = members.map((m) => m.id);
      const ownedSections = sections.filter((s) =>
        s.leadIds.some((id) => memberIds.includes(id))
      );
      const done = ownedSections.filter((s) => s.status === "complete").length;
      const cfg = ORG_CONFIG[org];
      return { org, cfg, members, ownedSections, done };
    });
  }, [sections]);

  // Deadline countdown
  const deadline = new Date("2026-06-10T23:59:59");
  const now = new Date();
  const daysLeft = Math.max(0, Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-6 fade-up">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FileText className="w-4 h-4" />}
          label="Overall Progress"
          value={`${stats.avgProgress}%`}
          sub={`${stats.complete} of ${stats.total} sections complete`}
          color="#2E75B6"
          ring={stats.avgProgress}
        />
        <StatCard
          icon={<Clock className="w-4 h-4" />}
          label="In Progress"
          value={stats.inProgress}
          sub="sections actively being worked"
          color="#17A589"
        />
        <StatCard
          icon={<AlertTriangle className="w-4 h-4" />}
          label="Blocked"
          value={stats.blocked}
          sub="sections needing attention"
          color="#C0392B"
        />
        <StatCard
          icon={<CheckCircle2 className="w-4 h-4" />}
          label="Documents"
          value={`${stats.docsVerified}/${stats.docsTotal}`}
          sub={`${stats.docsMissing} missing or action required`}
          color="#1E8449"
        />
      </div>

      {/* Deadline Banner */}
      <div
        className="rounded-lg px-5 py-4 flex items-center gap-4 border"
        style={{
          background: daysLeft <= 7 ? "#FEE2E2" : daysLeft <= 14 ? "#FEF9C3" : "#EBF5FB",
          borderColor: daysLeft <= 7 ? "#FCA5A5" : daysLeft <= 14 ? "#FDE68A" : "#BFDBFE",
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white text-sm"
          style={{ background: daysLeft <= 7 ? "#C0392B" : daysLeft <= 14 ? "#D97706" : "#2E75B6" }}
        >
          {daysLeft}d
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: daysLeft <= 7 ? "#C0392B" : daysLeft <= 14 ? "#92400E" : "#1A5C94" }}>
            {daysLeft <= 7 ? "⚠ URGENT — " : ""}{daysLeft} days until portal deadline (10 June 2026)
          </p>
          <p className="text-xs mt-0.5" style={{ color: daysLeft <= 7 ? "#991B1B" : "#596367" }}>
            Application ID: IA-0000000489 &nbsp;·&nbsp; DREAM 4 Health 2026 &nbsp;·&nbsp; USD 6,250,000 / 60 months
          </p>
        </div>
        <div className="ml-auto hidden sm:block">
          <div className="text-right">
            <p className="text-xs font-semibold text-muted-foreground">Target Submit</p>
            <p className="text-sm font-bold text-foreground">9 Jun 2026</p>
          </div>
        </div>
      </div>

      {/* Org Breakdown */}
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Team Workload by Organisation
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {orgStats.map(({ org, cfg, members, ownedSections, done }) => (
            <div
              key={org}
              className="bg-card rounded-lg p-4 border border-border shadow-sm hover:shadow-md transition-shadow duration-200"
              style={{ borderTopWidth: 3, borderTopColor: cfg.color }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: cfg.textColor }}>
                    {org.toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {members.filter((m) => m.id !== "kmitl_ro").slice(0, 2).map((m) => m.name).join(", ")}
                    {members.filter((m) => m.id !== "kmitl_ro").length > 2 && ` +${members.filter((m) => m.id !== "kmitl_ro").length - 2}`}
                  </p>
                </div>
                <ProgressRing
                  value={ownedSections.length ? Math.round((done / ownedSections.length) * 100) : 0}
                  size={44}
                  strokeWidth={4}
                  color={cfg.color}
                />
              </div>
              <div className="text-2xl font-bold tabular-nums" style={{ color: cfg.color }}>
                {ownedSections.length}
              </div>
              <p className="text-xs text-muted-foreground">sections assigned</p>
              <ProgressBar
                value={ownedSections.length ? Math.round((done / ownedSections.length) * 100) : 0}
                color={cfg.color}
                className="mt-2"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Org Legend */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(ORG_CONFIG) as OrgId[]).map((org) => {
          const cfg = ORG_CONFIG[org];
          return (
            <span
              key={org}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-border bg-card"
            >
              <span className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
              {cfg.label}
            </span>
          );
        })}
      </div>

      {/* Quick Ownership Matrix */}
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Section Ownership Matrix
        </h2>
        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider w-12">#</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider">Section</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider hidden md:table-cell">Lead Drafter(s)</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider hidden lg:table-cell">Role</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider w-24">Due</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider w-32">Status</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((s, i) => {
                const cfg = STATUS_CONFIG[s.status];
                return (
                  <tr
                    key={s.id}
                    className="border-t border-border hover:bg-muted/40 transition-colors duration-100"
                  >
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs font-bold text-primary">{s.num}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs font-medium">{s.title}</span>
                    </td>
                    <td className="px-4 py-2.5 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {s.leadIds.map((id) => (
                          <MemberPill key={id} memberId={id} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 hidden lg:table-cell">
                      <span className="text-xs text-muted-foreground italic">{s.roleNote}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs font-semibold text-destructive">{s.dueDate}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: cfg.bg, color: cfg.color }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
  ring,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  color: string;
  ring?: number;
}) {
  return (
    <div
      className="bg-card rounded-lg p-4 border border-border shadow-sm hover:shadow-md transition-shadow duration-200"
      style={{ borderTopWidth: 3, borderTopColor: color }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span style={{ color }}>{icon}</span>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
          </div>
          <p className="text-3xl font-bold tabular-nums" style={{ color }}>
            {value}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{sub}</p>
        </div>
        {ring !== undefined && (
          <ProgressRing value={ring} size={52} strokeWidth={5} color={color} />
        )}
      </div>
    </div>
  );
}
