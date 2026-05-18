// ACHIEVE-SEA Grant Submission Tracker — Main Dashboard
// Design: Neo-Institutional / Data Command Center
// Left sidebar + sticky header + tabbed content + activity log

import {
  Activity,
  AlertTriangle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  RefreshCw,
  Rows3,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTracker } from "@/contexts/SupabaseTrackerContext";
import { ORG_CONFIG, type OrgId } from "@/lib/data";
import { cn } from "@/lib/utils";
import DocumentsTab from "@/components/DocumentsTab";
import OverviewTab from "@/components/OverviewTab";
import SectionsTab from "@/components/SectionsTab";
import TimelineTab from "@/components/TimelineTab";
import TeamTab from "@/components/TeamTab";

type TabId = "overview" | "sections" | "documents" | "timeline" | "team";

const TABS: {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  shortLabel: string;
}[] = [
  {
    id: "overview",
    label: "Overview",
    shortLabel: "Overview",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    id: "sections",
    label: "All 19 Sections",
    shortLabel: "Sections",
    icon: <Rows3 className="w-4 h-4" />,
  },
  {
    id: "documents",
    label: "15 Documents",
    shortLabel: "Docs",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: "timeline",
    label: "Timeline",
    shortLabel: "Timeline",
    icon: <CalendarDays className="w-4 h-4" />,
  },
  {
    id: "team",
    label: "Team",
    shortLabel: "Team",
    icon: <Users className="w-4 h-4" />,
  },
];

function useDeadlineCountdown() {
  const deadline = new Date("2026-07-10T23:59:59");
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const diffDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  return diffDays;
}

function DashboardInner() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const {
    sections,
    documents,
    phases,
    resetAll,
    isOnline,
    isSyncing,
    supabaseConfigured,
  } = useTracker();
  const daysLeft = useDeadlineCountdown();

  const blockedCount = sections.filter(s => s.status === "blocked").length;
  const missingDocs = documents.filter(d => d.status === "missing").length;
  const completedTasks = phases
    .flatMap(p => p.tasks)
    .filter(t => t.done).length;
  const totalTasks = phases.flatMap(p => p.tasks).length;
  const overallProgress = Math.round(
    sections.reduce((a, s) => a + s.progress, 0) / sections.length
  );

  const handleReset = () => {
    if (
      window.confirm(
        "Reset all progress data to defaults? This cannot be undone."
      )
    ) {
      resetAll();
      toast.success("All data reset to defaults.");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ─── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        className={cn(
          "flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-out flex-shrink-0 relative z-20",
          sidebarCollapsed ? "w-14" : "w-56"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-sidebar-border min-h-[64px]">
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-sidebar-primary truncate">
                ACHIEVE-SEA
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                Grant Tracker
              </p>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex-shrink-0 p-1.5 rounded hover:bg-sidebar-accent transition-colors duration-150 text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Overall Progress */}
        {!sidebarCollapsed && (
          <div className="px-3 py-3 border-b border-sidebar-border">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-sidebar-foreground/60">
                Overall Progress
              </span>
              <span className="text-xs font-bold text-sidebar-primary tabular-nums">
                {overallProgress}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-sidebar-border rounded-full overflow-hidden">
              <div
                className="h-full bg-sidebar-primary rounded-full transition-all duration-700"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            let badge: number | null = null;
            if (tab.id === "sections" && blockedCount > 0) badge = blockedCount;
            if (tab.id === "documents" && missingDocs > 0) badge = missingDocs;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left transition-all duration-150 relative",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
                title={sidebarCollapsed ? tab.label : undefined}
              >
                <span className="flex-shrink-0">{tab.icon}</span>
                {!sidebarCollapsed && (
                  <>
                    <span className="text-xs flex-1 truncate">{tab.label}</span>
                    {badge !== null && (
                      <span className="flex-shrink-0 bg-destructive text-destructive-foreground text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                        {badge}
                      </span>
                    )}
                  </>
                )}
                {sidebarCollapsed && badge !== null && (
                  <span className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full text-[10px]">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Org Color Legend */}
        {!sidebarCollapsed && (
          <div className="px-3 py-3 border-t border-sidebar-border">
            <p className="text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider mb-2">
              Organisations
            </p>
            <div className="space-y-1">
              {(["kmitl", "erth", "ait", "recyglo", "uplb"] as OrgId[]).map(
                org => {
                  const cfg = ORG_CONFIG[org];
                  return (
                    <div key={org} className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: cfg.color }}
                      />
                      <span className="text-xs text-sidebar-foreground/60 truncate">
                        {cfg.label.split(" / ")[0].split(" (")[0]}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* Sidebar Footer */}
        <div className="border-t border-sidebar-border px-2 py-2 space-y-1">
          {!sidebarCollapsed && (
            <div className="px-2.5 py-2 rounded-md bg-sidebar-accent/30">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-sidebar-foreground/60">
                  Timeline Tasks
                </span>
                <span className="text-xs font-bold text-sidebar-primary tabular-nums">
                  {completedTasks}/{totalTasks}
                </span>
              </div>
              <div className="w-full h-1 bg-sidebar-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-sidebar-primary rounded-full transition-all duration-500"
                  style={{
                    width: `${totalTasks ? (completedTasks / totalTasks) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          )}
          <button
            onClick={handleReset}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors duration-150"
            title="Reset all data"
          >
            <RefreshCw className="w-3.5 h-3.5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-xs">Reset Data</span>}
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky Header */}
        <header className="flex-shrink-0 bg-primary text-primary-foreground px-6 py-3 flex items-center justify-between shadow-md z-10 min-h-[64px]">
          <div className="min-w-0 flex-1">
            <h1
              className="text-base font-bold tracking-tight truncate"
              style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              ACHIEVE-SEA — Full Application Tracker
            </h1>
            <p className="text-xs text-primary-foreground/70 mt-0.5 truncate">
              DREAM 4 Health 2026 &nbsp;·&nbsp; Application ID: IA-0000000489
              &nbsp;·&nbsp; USD 6,250,000 / 60 months
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            {!isOnline && (
              <div className="flex items-center gap-1.5 bg-yellow-500/20 text-yellow-200 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-xs font-bold">Offline</span>
              </div>
            )}
            {isOnline && isSyncing && (
              <div className="flex items-center gap-1.5 bg-blue-500/20 text-blue-200 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs font-bold">Syncing…</span>
              </div>
            )}
            {isOnline && !isSyncing && (
              <div
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${
                  supabaseConfigured
                    ? "text-green-600/60"
                    : "text-orange-600/60 bg-orange-500/10"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    supabaseConfigured ? "bg-green-500" : "bg-orange-500"
                  }`}
                />
                <span>
                  {supabaseConfigured ? "Live (Supabase)" : "Local Only"}
                </span>
              </div>
            )}
            {daysLeft <= 30 && daysLeft > 7 && (
              <div className="hidden sm:flex items-center gap-1.5 bg-yellow-500/20 text-yellow-200 px-2.5 py-1 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">{daysLeft} days left</span>
              </div>
            )}
            {daysLeft <= 7 && (
              <div className="flex items-center gap-1.5 bg-red-500/30 text-red-200 px-2.5 py-1 rounded-full animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">URGENT: {daysLeft}d</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-destructive text-destructive-foreground px-3 py-1.5 rounded-full shadow-sm">
              <span className="text-xs font-bold">⏱ Portal Deadline:</span>
              <span className="text-xs font-bold">10 Jul 2026</span>
              <span className="text-xs opacity-80 hidden sm:inline">
                ({daysLeft} days)
              </span>
            </div>
          </div>
        </header>

        {/* Tab Bar */}
        <div className="flex-shrink-0 bg-card border-b border-border px-4 sm:px-6 flex gap-0 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3 sm:px-4 py-3 text-xs font-semibold border-b-2 transition-all duration-150 whitespace-nowrap flex-shrink-0",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1300px] mx-auto px-4 sm:px-6 py-6">
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "sections" && <SectionsTab />}
            {activeTab === "documents" && <DocumentsTab />}
            {activeTab === "timeline" && <TimelineTab />}
            {activeTab === "team" && <TeamTab />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return <DashboardInner />;
}
