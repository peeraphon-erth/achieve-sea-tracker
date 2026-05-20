// ACHIEVE-SEA Grant Submission Tracker — Core Data Store
// Design: Neo-Institutional / Data Command Center
// All grant data, team members, and status types

export type TaskStatus =
  | "not_started"
  | "in_progress"
  | "review"
  | "complete"
  | "blocked";
export type DocStatus = "missing" | "unverified" | "verified" | "na";
export type OrgId = "kmitl" | "erth" | "ait" | "recyglo" | "pnc" | "uplb";

export interface TeamMember {
  id: string;
  name: string;
  org: OrgId;
  role: string;
  initials: string;
}

export interface Section {
  id: string;
  num: string;
  title: string;
  leadIds: string[];
  roleNote: string;
  dueDate: string;
  status: TaskStatus;
  progress: number; // 0-100
  notes: string;
  instruction?: string; // Detailed instructions for completing this section
}

export interface Document {
  id: string;
  docNum: string;
  title: string;
  sectionRef: string;
  ownerOrg: string;
  responsibleId: string;
  status: DocStatus;
  statusNote: string;
  dueDate: string;
}

export interface PhaseTask {
  id: string;
  ownerId: string;
  text: string;
  done: boolean;
  dueDate?: string;
}

export interface Phase {
  id: string;
  num: string;
  dates: string;
  name: string;
  color: string;
  tasks: PhaseTask[];
}

// ─── Team Members ────────────────────────────────────────────────────────────

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "ploy",
    name: "Dr. Ploypailin",
    org: "kmitl",
    role: "PI / Lead",
    initials: "PY",
  },
  {
    id: "kendo",
    name: "Kendo",
    org: "erth",
    role: "Project Manager",
    initials: "KE",
  },
  {
    id: "pallavi",
    name: "Pallavi",
    org: "ait",
    role: "Co-PI (AIT)",
    initials: "PA",
  },
  {
    id: "voravate",
    name: "Voravate",
    org: "ait",
    role: "Co-PI (AIT)",
    initials: "VO",
  },
  {
    id: "okka",
    name: "Okka",
    org: "recyglo",
    role: "Co-PI (RecyGlo)",
    initials: "OK",
  },
  {
    id: "janin",
    name: "Janin",
    org: "recyglo",
    role: "Portal Coordinator",
    initials: "JA",
  },
  {
    id: "ko",
    name: "Ko",
    org: "recyglo",
    role: "RecyGlo Team",
    initials: "KO",
  },
  {
    id: "aida",
    name: "Aida",
    org: "recyglo",
    role: "RecyGlo Team",
    initials: "AI",
  },
  {
    id: "rhea",
    name: "Rhea",
    org: "uplb",
    role: "Co-PI (UPLB)",
    initials: "RH",
  },
  {
    id: "hybunna",
    name: "Hybunna",
    org: "pnc",
    role: "Co-PI (PNC Cambodia)",
    initials: "HY",
  },
  {
    id: "santhad",
    name: "Santhad",
    org: "kmitl",
    role: "Deputy PI",
    initials: "SA",
  },
  {
    id: "kmitl_ro",
    name: "KMITL RO",
    org: "kmitl",
    role: "Research Office",
    initials: "RO",
  },
];

// ─── Org Config ──────────────────────────────────────────────────────────────

export const ORG_CONFIG: Record<
  OrgId,
  { label: string; color: string; bg: string; textColor: string }
> = {
  kmitl: {
    label: "KMITL",
    color: "#1F3864",
    bg: "#D6E4F0",
    textColor: "#1F3864",
  },
  erth: {
    label: "ERTH",
    color: "#17A589",
    bg: "#D1F2EB",
    textColor: "#0E7A67",
  },
  ait: {
    label: "AIT",
    color: "#2E75B6",
    bg: "#EBF5FB",
    textColor: "#1A5C94",
  },
  recyglo: {
    label: "RecyGlo",
    color: "#1E8449",
    bg: "#D5F5E3",
    textColor: "#1E8449",
  },
  pnc: {
    label: "PNC",
    color: "#7D6608",
    bg: "#FCF3CF",
    textColor: "#7D6608",
  },
  uplb: {
    label: "UPLB",
    color: "#CA6F1E",
    bg: "#FDEBD0",
    textColor: "#A05C18",
  },
};

// ─── Status Config ───────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  not_started: {
    label: "Not Started",
    color: "#596367",
    bg: "#F4F6F7",
    dot: "#9CA3AF",
  },
  in_progress: {
    label: "In Progress",
    color: "#1A5C94",
    bg: "#EBF5FB",
    dot: "#2E75B6",
  },
  review: {
    label: "Under Review",
    color: "#7D6608",
    bg: "#FEF9C3",
    dot: "#EAB308",
  },
  complete: {
    label: "Complete",
    color: "#1E8449",
    bg: "#D5F5E3",
    dot: "#22C55E",
  },
  blocked: {
    label: "Blocked",
    color: "#C0392B",
    bg: "#FADBD8",
    dot: "#EF4444",
  },
};

export const DOC_STATUS_CONFIG: Record<
  DocStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  missing: {
    label: "Missing / Action Required",
    color: "#C0392B",
    bg: "#FADBD8",
    dot: "#EF4444",
  },
  unverified: {
    label: "Needs Verification",
    color: "#7D6608",
    bg: "#FEF9C3",
    dot: "#EAB308",
  },
  verified: {
    label: "Exists / Compliant",
    color: "#1E8449",
    bg: "#D5F5E3",
    dot: "#22C55E",
  },
  na: {
    label: "Not Applicable",
    color: "#596367",
    bg: "#F4F6F7",
    dot: "#9CA3AF",
  },
};

// ─── Sections ────────────────────────────────────────────────────────────────

export const INITIAL_SECTIONS: Section[] = [
  {
    id: "s1",
    num: "S1",
    title: "Application Summary",
    leadIds: ["ploy", "santhad", "pallavi", "okka", "rhea", "hybunna"],
    roleNote: "Verify carry-over data",
    dueDate: "20 May",
    status: "not_started",
    progress: 0,
    notes: "",
  },
  {
    id: "s2",
    num: "S2",
    title: "Applicant Details (all profiles)",
    leadIds: ["kendo"],
    roleNote: "Consortium-wide ownership: each organization writes its own profile; project management compiles",
    dueDate: "22 May",
    status: "not_started",
    progress: 0,
    notes: "",
  },
  {
    id: "s3",
    num: "S3",
    title: "Consortium Collaborations",
    leadIds: ["kendo", "janin"],
    roleNote: "All organizations contribute 150-200 words; coordination team edits and enters in portal",
    dueDate: "27 May",
    status: "not_started",
    progress: 0,
    notes: "",
  },
  {
    id: "s4",
    num: "S4",
    title: "Research Proposal",
    leadIds: ["pallavi", "ploy"],
    roleNote: "Lead institution provides framing; AIT provides methodology; ERTH provides structure",
    dueDate: "27 May",
    status: "not_started",
    progress: 0,
    notes: "",
  },
  {
    id: "s5",
    num: "S5",
    title: "Research Involving Human Participants",
    leadIds: ["pallavi"],
    roleNote: "Draft",
    dueDate: "24 May",
    status: "not_started",
    progress: 0,
    notes: "",
  },
  {
    id: "s6",
    num: "S6",
    title: "Research Involving Animals",
    leadIds: ["kendo"],
    roleNote: "Consortium-wide ownership — not applicable; project management confirms in portal",
    dueDate: "20 May",
    status: "not_started",
    progress: 0,
    notes: "",
  },
  {
    id: "s7",
    num: "S7",
    title: "Research Management & Infrastructure",
    leadIds: ["ko"],
    roleNote: "Draft (coordination team suggested)",
    dueDate: "24 May",
    status: "not_started",
    progress: 0,
    notes: "",
  },
  {
    id: "s8",
    num: "S8",
    title: "Research Outputs Management & Sharing",
    leadIds: ["pallavi"],
    roleNote: "Draft",
    dueDate: "24 May",
    status: "not_started",
    progress: 0,
    notes: "",
  },
  {
    id: "s9",
    num: "S9",
    title: "Research Training & Development",
    leadIds: ["aida"],
    roleNote: "Draft (training lead suggested)",
    dueDate: "24 May",
    status: "not_started",
    progress: 0,
    notes: "",
  },
  {
    id: "s10",
    num: "S10",
    title: "Timetable & Milestones",
    leadIds: ["kendo", "janin"],
    roleNote: "All organizations send milestones; coordination team builds Gantt; project management reviews",
    dueDate: "27 May",
    status: "not_started",
    progress: 0,
    notes: "",
  },
  {
    id: "s11",
    num: "S11",
    title: "Consortium Budget Overview",
    leadIds: ["kendo"],
    roleNote: "Each organization fills CM sheet; project management consolidates",
    dueDate: "27 May",
    status: "not_started",
    progress: 0,
    notes: "",
  },
  {
    id: "s12",
    num: "S12",
    title: "Co-Funding",
    leadIds: ["kendo"],
    roleNote: "Draft",
    dueDate: "27 May",
    status: "not_started",
    progress: 0,
    notes: "",
  },
  {
    id: "s13",
    num: "S13",
    title: "MEL — Theory of Change & Logframe",
    leadIds: ["pallavi", "janin", "kendo"],
    roleNote:
      "AIT: ToC narrative + Logframe; coordination team: diagram + compile; project management: GEDI",
    dueDate: "30 May",
    status: "not_started",
    progress: 0,
    notes: "",
  },
  {
    id: "s14",
    num: "S14",
    title: "Public & Policy Engagement",
    leadIds: ["okka"],
    roleNote: "Draft (engagement lead suggested)",
    dueDate: "24 May",
    status: "not_started",
    progress: 0,
    notes: "",
  },
  {
    id: "s15",
    num: "S15",
    title: "Project Risk Evaluation",
    leadIds: ["pallavi", "ko", "janin"],
    roleNote:
      "AIT: data/tech risks; RecyGlo: field risks; coordination team: compile; project management: financial",
    dueDate: "30 May",
    status: "not_started",
    progress: 0,
    notes: "",
  },
  {
    id: "s16",
    num: "S16",
    title: "Environmental Sustainability",
    leadIds: ["janin"],
    roleNote: "Draft (coordination lead suggested)",
    dueDate: "24 May",
    status: "not_started",
    progress: 0,
    notes: "",
  },
  {
    id: "s17",
    num: "S17",
    title: "Reviewer Suggestions",
    leadIds: ["ploy"],
    roleNote: "Optional — PI enters directly in portal",
    dueDate: "5 Jun",
    status: "not_started",
    progress: 0,
    notes: "",
  },
  {
    id: "s18",
    num: "S18",
    title: "Eligibility & Consortium Org Chart",
    leadIds: ["janin"],
    roleNote:
      "Coordination team completes in portal and uploads org chart; project management drafts S18 eligibility",
    dueDate: "30 May",
    status: "not_started",
    progress: 0,
    notes: "",
  },
  {
    id: "s19",
    num: "S19",
    title: "E-Signature (PI)",
    leadIds: ["ploy"],
    roleNote: "PI signs after Research Office approval — final step",
    dueDate: "9 Jun",
    status: "not_started",
    progress: 0,
    notes: "",
  },
];

// ─── Documents ───────────────────────────────────────────────────────────────

export const INITIAL_DOCUMENTS: Document[] = [
  {
    id: "d1",
    docNum: "1",
    title: "LoS — PI Dr. Ploypailin (institutional, from KMITL)",
    sectionRef: "S2",
    ownerOrg: "KMITL",
    responsibleId: "ploy",
    status: "verified",
    statusNote: "Exists (institutional letter)",
    dueDate: "22 May",
  },
  {
    id: "d2",
    docNum: "2",
    title: "LoS — Deputy PI Santhad (institutional, from KMITL)",
    sectionRef: "S2",
    ownerOrg: "KMITL",
    responsibleId: "santhad",
    status: "unverified",
    statusNote: "Unverified (image PDF)",
    dueDate: "22 May",
  },
  {
    id: "d3a",
    docNum: "3a",
    title: "LoS — Co-PI Pallavi (from AIT)",
    sectionRef: "S2",
    ownerOrg: "AIT",
    responsibleId: "pallavi",
    status: "unverified",
    statusNote: "Unverified (image PDF)",
    dueDate: "22 May",
  },
  {
    id: "d3b",
    docNum: "3b",
    title: "LoS — Co-PI Okka (from RecyGlo)",
    sectionRef: "S2",
    ownerOrg: "RecyGlo",
    responsibleId: "okka",
    status: "unverified",
    statusNote: "Unverified (image PDF)",
    dueDate: "22 May",
  },
  {
    id: "d3c",
    docNum: "3c",
    title: "LoS — Co-PI Hybunna (from PNC Cambodia)",
    sectionRef: "S2",
    ownerOrg: "PNC",
    responsibleId: "hybunna",
    status: "missing",
    statusNote: "REWRITE REQUIRED (wrong addressee)",
    dueDate: "22 May",
  },
  {
    id: "d3d",
    docNum: "3d",
    title: "LoS — Co-PI Rhea (institutional, from UPLB)",
    sectionRef: "S2",
    ownerOrg: "UPLB",
    responsibleId: "rhea",
    status: "missing",
    statusNote: "MISSING (personal letter only)",
    dueDate: "22 May",
  },
  {
    id: "d4",
    docNum: "4",
    title: "Figures / Additional Info (max 2 A4 pages)",
    sectionRef: "S4",
    ownerOrg: "AIT",
    responsibleId: "kendo",
    status: "missing",
    statusNote: "To prepare",
    dueDate: "27 May",
  },
  {
    id: "d5",
    docNum: "5",
    title: "References (max 2 A4 pages, APA 7th)",
    sectionRef: "S4",
    ownerOrg: "AIT",
    responsibleId: "kendo",
    status: "missing",
    statusNote: "To prepare",
    dueDate: "27 May",
  },
  {
    id: "d6",
    docNum: "6",
    title: "NC3Rs ARRIVE checklist (if applicable)",
    sectionRef: "S6",
    ownerOrg: "Consortium-wide",
    responsibleId: "kendo",
    status: "unverified",
    statusNote: "Likely N/A — confirm",
    dueDate: "20 May",
  },
  {
    id: "d7",
    docNum: "7",
    title: "Sample size justification PDF (optional)",
    sectionRef: "S6",
    ownerOrg: "AIT",
    responsibleId: "kendo",
    status: "unverified",
    statusNote: "Check if needed",
    dueDate: "27 May",
  },
  {
    id: "d8",
    docNum: "8",
    title: "Research management / staffing diagram",
    sectionRef: "S7",
    ownerOrg: "RecyGlo",
    responsibleId: "kendo",
    status: "missing",
    statusNote: "To prepare",
    dueDate: "24 May",
  },
  {
    id: "d9",
    docNum: "9",
    title: "Gantt Chart (SEA DREAM template)",
    sectionRef: "S10",
    ownerOrg: "Consortium-wide",
    responsibleId: "kendo",
    status: "missing",
    statusNote: "To build",
    dueDate: "27 May",
  },
  {
    id: "d10",
    docNum: "10",
    title: "Full Application Budget Template (USD, mandatory)",
    sectionRef: "S11",
    ownerOrg: "Consortium-wide",
    responsibleId: "janin",
    status: "missing",
    statusNote: "CM sheets due 23 May",
    dueDate: "27 May",
  },
  {
    id: "d11",
    docNum: "11",
    title: "Overhead Justification Letter (if applicable)",
    sectionRef: "S11",
    ownerOrg: "KMITL",
    responsibleId: "ploy",
    status: "unverified",
    statusNote: "Confirm with KMITL RO",
    dueDate: "27 May",
  },
  {
    id: "d12",
    docNum: "12",
    title: "Co-Funding documents (if applicable)",
    sectionRef: "S12",
    ownerOrg: "ERTH",
    responsibleId: "kendo",
    status: "unverified",
    statusNote: "TBD",
    dueDate: "27 May",
  },
  {
    id: "d13",
    docNum: "13",
    title: "Theory of Change diagram (13_MEL_TOC.pdf)",
    sectionRef: "S13",
    ownerOrg: "ERTH",
    responsibleId: "kendo",
    status: "missing",
    statusNote: "To prepare",
    dueDate: "30 May",
  },
  {
    id: "d14",
    docNum: "14",
    title: "Logical Framework (13_MEL_Logframe.pdf)",
    sectionRef: "S13",
    ownerOrg: "AIT",
    responsibleId: "kendo",
    status: "missing",
    statusNote: "To prepare",
    dueDate: "30 May",
  },
  {
    id: "d15",
    docNum: "15",
    title: "Risk Register (15_ProjectRisk_RiskRegister.pdf)",
    sectionRef: "S15",
    ownerOrg: "Consortium-wide",
    responsibleId: "janin",
    status: "missing",
    statusNote: "To prepare",
    dueDate: "30 May",
  },
];

// ─── Timeline Phases ─────────────────────────────────────────────────────────

export const INITIAL_PHASES: Phase[] = [
  {
    id: "p1",
    num: "Phase 1",
    dates: "D-35 to D-30",
    name: "Initiation & Access Readiness",
    color: "#1F3864",
    tasks: [
      {
        id: "p1t1",
        ownerId: "ploy",
        text: "Confirm shortlist acceptance and portal workspace availability",
        done: false,
      },
      {
        id: "p1t2",
        ownerId: "ploy",
        text: "Invite and confirm institutional approval reviewers in the portal",
        done: false,
      },
      {
        id: "p1t3",
        ownerId: "kendo",
        text: "Publish task briefs, templates, and working conventions to all organizations",
        done: false,
      },
      {
        id: "p1t4",
        ownerId: "kendo",
        text: "Resolve any eligibility or classification clarifications with the program team",
        done: false,
      },
      {
        id: "p1t5",
        ownerId: "kendo",
        text: "Distribute LoS templates and validate currently available institutional letters",
        done: false,
      },
    ],
  },
  {
    id: "p2a",
    num: "Phase 2a",
    dates: "D-29 to D-26",
    name: "Inputs Collection I",
    color: "#2E75B6",
    tasks: [
      {
        id: "p2at1",
        ownerId: "kendo",
        text: "Complete S1 verification, start S12 co-funding, and start S18 eligibility drafting",
        done: false,
      },
      {
        id: "p2at2",
        ownerId: "kendo",
        text: "Prepare coordination package: folder map, chase list, and portal operation notes",
        done: false,
      },
      {
        id: "p2at3",
        ownerId: "kendo",
        text: "Request CM budget sheets from all organizations with a clear return deadline",
        done: false,
      },
      {
        id: "p2at4",
        ownerId: "ploy",
        text: "Submit lead profile inputs and initial proposal framing to the coordination channel",
        done: false,
      },
      {
        id: "p2at5",
        ownerId: "janin",
        text: "Collect pending LoS files and profile inputs and file them in shared coordination storage",
        done: false,
      },
    ],
  },
  {
    id: "p2b",
    num: "Phase 2b",
    dates: "D-25 to D-22",
    name: "Inputs Collection II & Triage",
    color: "#7D6608",
    tasks: [
      {
        id: "p2bt1",
        ownerId: "janin",
        text: "Centralize intake for drafts, LoS letters, and budget sheets",
        done: false,
      },
      {
        id: "p2bt2",
        ownerId: "janin",
        text: "Finalize S7, S9, S14, and S16 drafts and route for integration",
        done: false,
      },
      {
        id: "p2bt3",
        ownerId: "pallavi",
        text: "Submit S3 inputs, S4 methodology, S5, S8, and references for review",
        done: false,
      },
      {
        id: "p2bt4",
        ownerId: "janin",
        text: "Follow up on missing inputs and escalate blockers through the decision channel",
        done: false,
      },
      {
        id: "p2bt5",
        ownerId: "kendo",
        text: "Provide rapid decisions for blockers and scope questions",
        done: false,
      },
    ],
  },
  {
    id: "p3",
    num: "Phase 3",
    dates: "D-21 to D-14",
    name: "Core Drafting",
    color: "#CA6F1E",
    tasks: [
      {
        id: "p3t1",
        ownerId: "janin",
        text: "Confirm all budget sheets are received and flag missing items immediately",
        done: false,
      },
      {
        id: "p3t2",
        ownerId: "kendo",
        text: "Review and approve consolidated budget figures",
        done: false,
      },
      {
        id: "p3t3",
        ownerId: "janin",
        text: "Collect milestone inputs and draft Gantt content for S10",
        done: false,
      },
      {
        id: "p3t4",
        ownerId: "janin",
        text: "Integrate S3 organizational inputs into a coherent narrative",
        done: false,
      },
      {
        id: "p3t5",
        ownerId: "pallavi",
        text: "Submit S13 ToC and logframe content plus S15 technical/IRB risk inputs",
        done: false,
      },
      {
        id: "p3t6",
        ownerId: "okka",
        text: "Submit S15 field and operational risk inputs",
        done: false,
      },
      {
        id: "p3t7",
        ownerId: "janin",
        text: "Assemble complete S4 draft for integration",
        done: false,
      },
    ],
  },
  {
    id: "p4",
    num: "Phase 4",
    dates: "D-13 to D-9",
    name: "Integration & Consistency",
    color: "#17A589",
    tasks: [
      {
        id: "p4t1",
        ownerId: "janin",
        text: "Integrate drafted sections into portal and upload collected documents",
        done: false,
      },
      {
        id: "p4t2",
        ownerId: "janin",
        text: "Finalize S13 package including ToC diagram and logframe artifacts",
        done: false,
      },
      {
        id: "p4t3",
        ownerId: "janin",
        text: "Compile S15 risk inputs into a single risk register document",
        done: false,
      },
      {
        id: "p4t4",
        ownerId: "janin",
        text: "Complete S18 eligibility details and upload consortium org chart",
        done: false,
      },
      {
        id: "p4t5",
        ownerId: "kendo",
        text: "Run cross-section consistency review and align budget/risk narratives",
        done: false,
      },
      {
        id: "p4t6",
        ownerId: "ploy",
        text: "Run full S2 profile validation and flag data-entry errors",
        done: false,
      },
    ],
  },
  {
    id: "p5",
    num: "Phase 5",
    dates: "D-8 to D-6",
    name: "Internal QA & Revision",
    color: "#6C3483",
    tasks: [
      {
        id: "p5t1",
        ownerId: "ploy",
        text: "Review integrated portal draft and provide consolidated comments",
        done: false,
      },
      {
        id: "p5t2",
        ownerId: "santhad",
        text: "Review S2 profiles (Deputy PI focus)",
        done: false,
      },
      {
        id: "p5t3",
        ownerId: "kendo",
        text: "Implement review comments and finalize submission package for institutional review",
        done: false,
      },
      {
        id: "p5t4",
        ownerId: "ploy",
        text: "Enter S17 reviewer suggestions (optional)",
        done: false,
      },
    ],
  },
  {
    id: "p6",
    num: "Phase 6",
    dates: "D-5 to D-3",
    name: "Institutional Approval Gate",
    color: "#C0392B",
    tasks: [
      {
        id: "p6t1",
        ownerId: "kmitl_ro",
        text: "Research Office reviews application in portal — budget, compliance, institutional commitments",
        done: false,
      },
      {
        id: "p6t2",
        ownerId: "kendo",
        text: "Address institutional review comments within same-day turnaround",
        done: false,
      },
      {
        id: "p6t3",
        ownerId: "kmitl_ro",
        text: "Give formal approval in portal to unlock the PI e-signature step",
        done: false,
      },
      {
        id: "p6t4",
        ownerId: "kendo",
        text: "Track approval dependency as critical path and escalate unresolved blockers within 24 hours",
        done: false,
      },
    ],
  },
  {
    id: "p7",
    num: "Phase 7",
    dates: "D-2 to D-1",
    name: "Submission & Confirmation",
    color: "#1E8449",
    tasks: [
      {
        id: "p7t1",
        ownerId: "ploy",
        text: "Complete S19 e-signature in grants.sea-dream.org portal",
        done: false,
      },
      {
        id: "p7t2",
        ownerId: "kendo",
        text: "Confirm submission evidence and archive the submitted application package",
        done: false,
      },
      {
        id: "p7t3",
        ownerId: "kendo",
        text: "Submit with at least one-day operational buffer before final deadline",
        done: false,
      },
    ],
  },
];
