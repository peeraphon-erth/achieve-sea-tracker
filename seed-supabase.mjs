#!/usr/bin/env node

/**
 * Seed Supabase with ACHIEVE-SEA tracker data
 * Usage: node seed-supabase.mjs
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://iecxnthkbewgzzdjepqv.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllY3hudGhrYmV3Z3p6ZGplcHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5OTQ0ODMsImV4cCI6MjA5NDU3MDQ4M30.AAsLJ78WL_O8Fgo4VjxFt6CHCKe4f7mTvTn3ECxgRSc";

const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Data ────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "s1", num: "S1", title: "Application Summary", leadIds: JSON.stringify(["kendo"]), roleNote: "Verify carry-over data", dueDate: "20 May", status: "not_started", progress: 0, notes: "" },
  { id: "s2", num: "S2", title: "Applicant Details (all profiles)", leadIds: JSON.stringify(["all"]), roleNote: "Each writes own profile; Kendo compiles", dueDate: "22 May", status: "not_started", progress: 0, notes: "" },
  { id: "s3", num: "S3", title: "Consortium Collaborations", leadIds: JSON.stringify(["janin"]), roleNote: "All orgs write 150–200 words; Janin edits + enters portal", dueDate: "27 May", status: "not_started", progress: 0, notes: "" },
  { id: "s4", num: "S4", title: "Research Proposal", leadIds: JSON.stringify(["pallavi", "ploy"]), roleNote: "Ploy: framing; AIT: methodology; ERTH: structure", dueDate: "27 May", status: "not_started", progress: 0, notes: "" },
  { id: "s5", num: "S5", title: "Research Involving Human Participants", leadIds: JSON.stringify(["pallavi"]), roleNote: "Draft", dueDate: "24 May", status: "not_started", progress: 0, notes: "" },
  { id: "s6", num: "S6", title: "Research Involving Animals", leadIds: JSON.stringify(["all"]), roleNote: "Not applicable — confirm in portal", dueDate: "20 May", status: "not_started", progress: 0, notes: "" },
  { id: "s7", num: "S7", title: "Research Management & Infrastructure", leadIds: JSON.stringify(["janin", "ko"]), roleNote: "Draft (Janin or Ko suggested)", dueDate: "24 May", status: "not_started", progress: 0, notes: "" },
  { id: "s8", num: "S8", title: "Research Outputs Management & Sharing", leadIds: JSON.stringify(["pallavi"]), roleNote: "Draft", dueDate: "24 May", status: "not_started", progress: 0, notes: "" },
  { id: "s9", num: "S9", title: "Research Training & Development", leadIds: JSON.stringify(["aida"]), roleNote: "Draft (Aida suggested)", dueDate: "24 May", status: "not_started", progress: 0, notes: "" },
  { id: "s10", num: "S10", title: "Timetable & Milestones", leadIds: JSON.stringify(["janin"]), roleNote: "All orgs send milestones; Janin builds Gantt; Kendo reviews", dueDate: "27 May", status: "not_started", progress: 0, notes: "" },
  { id: "s11", num: "S11", title: "Consortium Budget Overview", leadIds: JSON.stringify(["kendo"]), roleNote: "Each org fills CM sheet; Kendo consolidates", dueDate: "27 May", status: "not_started", progress: 0, notes: "" },
  { id: "s12", num: "S12", title: "Co-Funding", leadIds: JSON.stringify(["kendo"]), roleNote: "Draft", dueDate: "27 May", status: "not_started", progress: 0, notes: "" },
  { id: "s13", num: "S13", title: "MEL — Theory of Change & Logframe", leadIds: JSON.stringify(["pallavi", "janin"]), roleNote: "AIT: ToC narrative + Logframe; Janin: diagram + compile; Kendo: GEDI", dueDate: "30 May", status: "not_started", progress: 0, notes: "" },
  { id: "s14", num: "S14", title: "Public & Policy Engagement", leadIds: JSON.stringify(["okka", "ko"]), roleNote: "Draft (Okka or Ko suggested)", dueDate: "24 May", status: "not_started", progress: 0, notes: "" },
  { id: "s15", num: "S15", title: "Project Risk Evaluation", leadIds: JSON.stringify(["pallavi", "okka", "janin"]), roleNote: "AIT: data/tech risks; RecyGlo: field risks; Janin: compile; Kendo: financial", dueDate: "30 May", status: "not_started", progress: 0, notes: "" },
  { id: "s16", num: "S16", title: "Environmental Sustainability", leadIds: JSON.stringify(["janin"]), roleNote: "Draft (Janin suggested)", dueDate: "24 May", status: "not_started", progress: 0, notes: "" },
  { id: "s17", num: "S17", title: "Reviewer Suggestions", leadIds: JSON.stringify(["ploy"]), roleNote: "Optional — Dr. Ploy enters directly in portal", dueDate: "5 Jun", status: "not_started", progress: 0, notes: "" },
  { id: "s18", num: "S18", title: "Eligibility & Consortium Org Chart", leadIds: JSON.stringify(["janin", "kendo"]), roleNote: "Janin completes in portal; upload org chart; Kendo: S18 eligibility draft", dueDate: "30 May", status: "not_started", progress: 0, notes: "" },
  { id: "s19", num: "S19", title: "E-Signature (PI)", leadIds: JSON.stringify(["ploy"]), roleNote: "Dr. Ploy signs after RO approval — final step", dueDate: "9 Jun", status: "not_started", progress: 0, notes: "" },
];

const DOCUMENTS = [
  { id: "d1", docNum: "1", title: "LoS — PI Dr. Ploypailin (institutional, from KMITL)", sectionRef: "S2", responsibleId: "ploy", status: "verified", statusNote: "Exists (institutional letter)", dueDate: "22 May" },
  { id: "d2", docNum: "2", title: "LoS — Deputy PI Santhad (institutional, from UPLB)", sectionRef: "S2", responsibleId: "santhad", status: "unverified", statusNote: "Unverified (image PDF)", dueDate: "22 May" },
  { id: "d3a", docNum: "3a", title: "LoS — Co-PI Pallavi (from AIT)", sectionRef: "S2", responsibleId: "pallavi", status: "unverified", statusNote: "Unverified (image PDF)", dueDate: "22 May" },
  { id: "d3b", docNum: "3b", title: "LoS — Co-PI Okka (from RecyGlo)", sectionRef: "S2", responsibleId: "okka", status: "unverified", statusNote: "Unverified (image PDF)", dueDate: "22 May" },
  { id: "d3c", docNum: "3c", title: "LoS — Co-PI Hybunna (from PNC Cambodia)", sectionRef: "S2", responsibleId: "hybunna", status: "missing", statusNote: "REWRITE REQUIRED (wrong addressee)", dueDate: "22 May" },
  { id: "d3d", docNum: "3d", title: "LoS — Co-PI Rhea (institutional, from UPLB)", sectionRef: "S2", responsibleId: "rhea", status: "missing", statusNote: "MISSING (personal letter only)", dueDate: "22 May" },
  { id: "d4", docNum: "4", title: "Figures / Additional Info (max 2 A4 pages)", sectionRef: "S4", responsibleId: "kendo", status: "missing", statusNote: "To prepare", dueDate: "27 May" },
  { id: "d5", docNum: "5", title: "References (max 2 A4 pages, APA 7th)", sectionRef: "S4", responsibleId: "kendo", status: "missing", statusNote: "To prepare", dueDate: "27 May" },
  { id: "d6", docNum: "6", title: "NC3Rs ARRIVE checklist (if applicable)", sectionRef: "S6", responsibleId: "kendo", status: "unverified", statusNote: "Likely N/A — confirm", dueDate: "20 May" },
  { id: "d7", docNum: "7", title: "Sample size justification PDF (optional)", sectionRef: "S6", responsibleId: "kendo", status: "unverified", statusNote: "Check if needed", dueDate: "27 May" },
  { id: "d8", docNum: "8", title: "Research management / staffing diagram", sectionRef: "S7", responsibleId: "kendo", status: "missing", statusNote: "To prepare", dueDate: "24 May" },
  { id: "d9", docNum: "9", title: "Gantt Chart (SEA DREAM template)", sectionRef: "S10", responsibleId: "kendo", status: "missing", statusNote: "To build", dueDate: "27 May" },
  { id: "d10", docNum: "10", title: "Full Application Budget Template (USD, mandatory)", sectionRef: "S11", responsibleId: "janin", status: "missing", statusNote: "CM sheets due 23 May", dueDate: "27 May" },
  { id: "d11", docNum: "11", title: "Overhead Justification Letter (if applicable)", sectionRef: "S11", responsibleId: "ploy", status: "unverified", statusNote: "Confirm with KMITL RO", dueDate: "27 May" },
  { id: "d12", docNum: "12", title: "Co-Funding documents (if applicable)", sectionRef: "S12", responsibleId: "kendo", status: "unverified", statusNote: "TBD", dueDate: "27 May" },
  { id: "d13", docNum: "13", title: "Theory of Change diagram (13_MEL_TOC.pdf)", sectionRef: "S13", responsibleId: "kendo", status: "missing", statusNote: "To prepare", dueDate: "30 May" },
  { id: "d14", docNum: "14", title: "Logical Framework (13_MEL_Logframe.pdf)", sectionRef: "S13", responsibleId: "kendo", status: "missing", statusNote: "To prepare", dueDate: "30 May" },
  { id: "d15", docNum: "15", title: "Risk Register (15_ProjectRisk_RiskRegister.pdf)", sectionRef: "S15", responsibleId: "janin", status: "missing", statusNote: "To prepare", dueDate: "30 May" },
];

const PHASES = [
  {
    id: "p1",
    num: "Phase 1",
    dates: "16–19 May",
    name: "Kickoff",
    color: "#1F3864",
    tasks: JSON.stringify([
      { id: "p1t1", ownerId: "ploy", text: "Accept shortlist invitation in grants.sea-dream.org portal", done: false },
      { id: "p1t2", ownerId: "ploy", text: "Invite KMITL Research Office (RO) to portal — critical path dependency", done: false },
      { id: "p1t3", ownerId: "kendo", text: "Share task briefs with all team members; send budget Excel template to each org lead", done: false },
      { id: "p1t4", ownerId: "kendo", text: "Email SEA DREAM re: AIT country classification (Thailand vs. regional)", done: false },
      { id: "p1t5", ownerId: "kendo", text: "Send LoS templates to Hybunna (PNC) and Rhea (UPLB); verify AIT + RecyGlo existing letters", done: false },
    ]),
  },
  {
    id: "p2a",
    num: "Phase 2a",
    dates: "20–22 May",
    name: "Kendo — Pre-departure",
    color: "#2E75B6",
    tasks: JSON.stringify([
      { id: "p2at1", ownerId: "kendo", text: "Complete S1 verification; draft S12 co-funding; begin S18 eligibility — finish all ERTH-only drafting before departure", done: false },
      { id: "p2at2", ownerId: "kendo", text: "Prepare handover doc for Janin: shared folder structure, chase list, portal login instructions", done: false },
      { id: "p2at3", ownerId: "kendo", text: "Send budget CM sheets to all orgs with hard deadline: 23 May (before departure)", done: false },
      { id: "p2at4", ownerId: "ploy", text: "S2 profile + S4 framing → to Janin by 22 May", done: false },
      { id: "p2at5", ownerId: "all", text: "Rhea, Hybunna, Santhad: all LoS + profiles due 22 May — submit to Janin's shared folder", done: false },
    ]),
  },
  {
    id: "p2b",
    num: "Phase 2b",
    dates: "23–24 May",
    name: "Janin Coordinates",
    color: "#7D6608",
    tasks: JSON.stringify([
      { id: "p2bt1", ownerId: "janin", text: "Take over admin coordination — receive all incoming drafts, LoS letters, and budget CM sheets", done: false },
      { id: "p2bt2", ownerId: "janin", text: "S7 (Janin/Ko), S9 (Aida), S14 (Okka/Ko), S16 (Janin) — final drafts due to Janin by 24 May", done: false },
      { id: "p2bt3", ownerId: "pallavi", text: "S3 input, S4 methodology, S5, S8, References — due to Janin by 24 May", done: false },
      { id: "p2bt4", ownerId: "janin", text: "Chase any missing inputs (budget sheets, profiles, LoS letters) — escalate to Kendo async only if blocked", done: false },
      { id: "p2bt5", ownerId: "kendo", text: "Available for urgent decisions only — WhatsApp/email. Not for drafting.", done: false },
    ]),
  },
  {
    id: "p3",
    num: "Phase 3",
    dates: "25–27 May",
    name: "Hard Gate — Janin Coordinates",
    color: "#CA6F1E",
    tasks: JSON.stringify([
      { id: "p3t1", ownerId: "janin", text: "Confirm all CM budget sheets received (due 23 May from orgs); flag any missing to Kendo async immediately", done: false },
      { id: "p3t2", ownerId: "kendo", text: "Review and approve budget figures by 27 May — Janin collects, Kendo signs off numbers remotely", done: false },
      { id: "p3t3", ownerId: "janin", text: "Collect all org milestone inputs; build Gantt in Excel template (S10)", done: false },
      { id: "p3t4", ownerId: "janin", text: "Integrate S3 org inputs into coherent narrative; enter in portal", done: false },
      { id: "p3t5", ownerId: "pallavi", text: "S13 ToC narrative + Logframe due 26 May → to Janin. S15 data/tech/IRB risks due 26 May → to Janin.", done: false },
      { id: "p3t6", ownerId: "okka", text: "S15 field/operational risks due 26 May → to Janin", done: false },
      { id: "p3t7", ownerId: "janin", text: "Integrate S4 full draft (Ploy framing + AIT methodology) in portal by 27 May", done: false },
    ]),
  },
  {
    id: "p4",
    num: "Phase 4",
    dates: "28–30 May",
    name: "Integration — Janin Coordinates",
    color: "#17A589",
    tasks: JSON.stringify([
      { id: "p4t1", ownerId: "janin", text: "Enter all drafted sections into portal; upload all collected documents", done: false },
      { id: "p4t2", ownerId: "janin", text: "S13: compile AIT's ToC narrative + Logframe; commission and produce ToC flow diagram (PowerPoint → PDF)", done: false },
      { id: "p4t3", ownerId: "janin", text: "S15: compile AIT + RecyGlo risk inputs into single register; export as 15_ProjectRisk_RiskRegister.pdf", done: false },
      { id: "p4t4", ownerId: "janin", text: "S18: complete eligibility info in portal; upload consortium org chart", done: false },
      { id: "p4t5", ownerId: "kendo", text: "Review integrated portal draft end of 30 May; confirm S11 budget narrative is accurate; add financial risks to S15", done: false },
      { id: "p4t6", ownerId: "ploy", text: "S2 full check: confirm all Co-PI profiles entered correctly; flag any errors to Janin", done: false },
    ]),
  },
  {
    id: "p5",
    num: "Phase 5",
    dates: "2–4 Jun",
    name: "Internal Review",
    color: "#6C3483",
    tasks: JSON.stringify([
      { id: "p5t1", ownerId: "ploy", text: "Review full integrated draft in portal; provide consolidated comments to Kendo by 3 Jun", done: false },
      { id: "p5t2", ownerId: "santhad", text: "Review S2 profiles (Deputy PI focus)", done: false },
      { id: "p5t3", ownerId: "kendo", text: "Implement all review comments; confirm S11 budget narrative final; application ready for RO by 5 Jun", done: false },
      { id: "p5t4", ownerId: "ploy", text: "Enter S17 reviewer suggestions (optional)", done: false },
    ]),
  },
  {
    id: "p6",
    num: "Phase 6",
    dates: "5–7 Jun",
    name: "RO Gate",
    color: "#C0392B",
    tasks: JSON.stringify([
      { id: "p6t1", ownerId: "kmitl_ro", text: "Research Office reviews application in portal — budget, compliance, institutional commitments", done: false },
      { id: "p6t2", ownerId: "kendo", text: "Address any RO comments immediately (same-day turnaround required)", done: false },
      { id: "p6t3", ownerId: "kmitl_ro", text: "Give formal approval in portal — this unlocks Dr. Ploy's e-signature step", done: false },
      { id: "p6t4", ownerId: "all", text: "⚠ Critical path: RO approval is the single biggest delay risk. RO must be in the portal by 19 May.", done: false },
    ]),
  },
  {
    id: "p7",
    num: "Phase 7",
    dates: "8–9 Jun",
    name: "Submit",
    color: "#1E8449",
    tasks: JSON.stringify([
      { id: "p7t1", ownerId: "ploy", text: "Complete S19 e-signature in grants.sea-dream.org portal", done: false },
      { id: "p7t2", ownerId: "kendo", text: "Confirm submission confirmation email received; retain copy of submitted application", done: false },
      { id: "p7t3", ownerId: "all", text: "🎯 Portal deadline: 10 June 2026 — submit by 9 June to have buffer", done: false },
    ]),
  },
];

// ─── Seed Functions ──────────────────────────────────────────────────────

async function seedTable(tableName, data) {
  try {
    console.log(`\n📝 Seeding ${tableName}...`);

    // Delete existing data
    const { error: deleteError } = await supabase.from(tableName).delete().neq("id", "");
    if (deleteError) {
      console.warn(`  ⚠️  Could not clear table (may be empty): ${deleteError.message}`);
    }

    // Insert new data
    const { error: insertError, data: result } = await supabase.from(tableName).insert(data);

    if (insertError) {
      console.error(`  ❌ Error seeding ${tableName}:`, insertError.message);
      return false;
    }

    console.log(`  ✅ Seeded ${data.length} ${tableName}`);
    return true;
  } catch (err) {
    console.error(`  ❌ Exception in ${tableName}:`, err.message);
    return false;
  }
}

async function main() {
  console.log("🌱 Starting Supabase seed...\n");

  const results = await Promise.all([
    seedTable("sections", SECTIONS),
    seedTable("documents", DOCUMENTS),
    seedTable("phases", PHASES),
  ]);

  if (results.every((r) => r)) {
    console.log("\n✨ All tables seeded successfully!");
    process.exit(0);
  } else {
    console.log("\n⚠️  Some tables failed to seed. Check errors above.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
