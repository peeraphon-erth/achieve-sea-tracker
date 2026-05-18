// ACHIEVE-SEA Tracker — Shared UI Components
// Design: Neo-Institutional / Data Command Center
// OrgPill, StatusBadge, ProgressRing, TeamMemberSelect

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  DOC_STATUS_CONFIG,
  ORG_CONFIG,
  STATUS_CONFIG,
  TEAM_MEMBERS,
  type DocStatus,
  type OrgId,
  type TaskStatus,
} from "@/lib/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// ─── Org Pill ────────────────────────────────────────────────────────────────

export function OrgPill({ orgId, name }: { orgId: OrgId; name?: string }) {
  const cfg = ORG_CONFIG[orgId];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.textColor }}
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: cfg.color }}
      />
      {name ?? cfg.label.split(" / ")[0].split(" (")[0]}
    </span>
  );
}

// ─── Member Pill ─────────────────────────────────────────────────────────────

export function MemberPill({ memberId }: { memberId: string }) {
  const member = TEAM_MEMBERS.find((m) => m.id === memberId);
  if (!member) return null;
  const cfg = ORG_CONFIG[member.org];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.textColor }}
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: cfg.color }}
      />
      {member.name}
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

interface StatusBadgeProps {
  status: TaskStatus;
  onChange?: (s: TaskStatus) => void;
  compact?: boolean;
}

export function StatusBadge({ status, onChange, compact }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  const statuses = Object.keys(STATUS_CONFIG) as TaskStatus[];

  if (!onChange) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap",
          compact ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
        )}
        style={{ background: cfg.bg, color: cfg.color }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
        {cfg.label}
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap transition-all duration-150 hover:opacity-80 active:scale-95",
            compact ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
          )}
          style={{ background: cfg.bg, color: cfg.color }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
          {cfg.label}
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        {statuses.map((s) => {
          const c = STATUS_CONFIG[s];
          return (
            <DropdownMenuItem
              key={s}
              onClick={() => onChange(s)}
              className="flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.dot }} />
              <span className="text-xs">{c.label}</span>
              {s === status && <Check className="w-3 h-3 ml-auto" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Doc Status Badge ─────────────────────────────────────────────────────────

interface DocStatusBadgeProps {
  status: DocStatus;
  onChange?: (s: DocStatus) => void;
}

export function DocStatusBadge({ status, onChange }: DocStatusBadgeProps) {
  const cfg = DOC_STATUS_CONFIG[status];
  const statuses = Object.keys(DOC_STATUS_CONFIG) as DocStatus[];

  if (!onChange) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
        style={{ background: cfg.bg, color: cfg.color }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
        {cfg.label}
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 hover:opacity-80 active:scale-95"
          style={{ background: cfg.bg, color: cfg.color }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
          {cfg.label}
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        {statuses.map((s) => {
          const c = DOC_STATUS_CONFIG[s];
          return (
            <DropdownMenuItem
              key={s}
              onClick={() => onChange(s)}
              className="flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.dot }} />
              <span className="text-xs">{c.label}</span>
              {s === status && <Check className="w-3 h-3 ml-auto" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Progress Ring ────────────────────────────────────────────────────────────

export function ProgressRing({
  value,
  size = 56,
  strokeWidth = 5,
  color = "#2E75B6",
  label,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.23,1,0.32,1)" }}
        />
      </svg>
      <span
        className="absolute text-xs font-bold tabular-nums"
        style={{ color }}
      >
        {label ?? `${value}%`}
      </span>
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

export function ProgressBar({
  value,
  color = "#2E75B6",
  className,
}: {
  value: number;
  color?: string;
  className?: string;
}) {
  return (
    <div className={cn("w-full h-1.5 bg-border rounded-full overflow-hidden", className)}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}

// ─── Inline Progress Editor ───────────────────────────────────────────────────

export function ProgressEditor({
  value,
  onChange,
  color = "#2E75B6",
}: {
  value: number;
  onChange: (v: number) => void;
  color?: string;
}) {
  const [open, setOpen] = useState(false);
  const steps = [0, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 w-full group hover:opacity-80 transition-opacity">
          <ProgressBar value={value} color={color} className="flex-1" />
          <span className="text-xs font-semibold tabular-nums w-8 text-right" style={{ color }}>
            {value}%
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-3" align="start">
        <p className="text-xs font-semibold text-muted-foreground mb-2">Set Progress</p>
        <div className="flex flex-wrap gap-1.5">
          {steps.map((s) => (
            <button
              key={s}
              onClick={() => { onChange(s); setOpen(false); }}
              className={cn(
                "px-2 py-1 rounded text-xs font-semibold transition-all duration-100",
                s === value
                  ? "text-white"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              )}
              style={s === value ? { background: color } : undefined}
            >
              {s}%
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ─── Team Member Select ───────────────────────────────────────────────────────

export function TeamMemberSelect({
  selectedIds,
  onChange,
  multiple = true,
}: {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  multiple?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const toggle = (id: string) => {
    if (!multiple) {
      onChange([id]);
      setOpen(false);
      return;
    }
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex flex-wrap gap-1 items-center min-h-[28px] hover:opacity-80 transition-opacity">
          {selectedIds.length === 0 ? (
            <span key="placeholder" className="text-xs text-muted-foreground">Assign…</span>
          ) : (
            selectedIds.map((id) => <MemberPill key={id} memberId={id} />)
          )}
          <ChevronDown key="chevron" className="w-3 h-3 text-muted-foreground ml-1" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <p className="text-xs font-semibold text-muted-foreground px-2 py-1 mb-1">
          {multiple ? "Select assignees" : "Reassign to"}
        </p>
        <div className="max-h-60 overflow-y-auto">
          {TEAM_MEMBERS.map((m) => {
            const cfg = ORG_CONFIG[m.org];
            const selected = selectedIds.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggle(m.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors duration-100",
                  selected ? "bg-accent" : "hover:bg-muted"
                )}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: cfg.color }}
                >
                  {m.initials}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{m.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{m.role}</p>
                </div>
                {selected && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
