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
  { id: "s1", num: "S1", title: "Application Summary", leadIds: JSON.stringify(["kendo"]), roleNote: "Verify carry-over data", dueDate: "23 May", status: "not_started", progress: 0, notes: "" },
  { id: "s2", num: "S2", title: "Applicant Details (all profiles)", leadIds: JSON.stringify(["ploy", "santhad", "pallavi", "okka", "rhea", "hybunna"]), roleNote: "Consortium-wide ownership: each organization writes its own profile; project management compiles", dueDate: "22 May", status: "not_started", progress: 0, notes: "" },
  { id: "s3", num: "S3", title: "Consortium Collaborations", leadIds: JSON.stringify(["kendo", "santhad", "pallavi", "okka", "hybunna", "rhea"]), roleNote: "All organizations contribute 150-200 words; coordination team edits and enters in portal", dueDate: "13 Jun", status: "not_started", progress: 0, notes: "" },
  { id: "s4", num: "S4", title: "Research Proposal", leadIds: JSON.stringify(["pallavi", "ploy"]), roleNote: "Lead institution provides framing; AIT provides methodology; ERTH provides structure", dueDate: "20 Jun", status: "not_started", progress: 0, notes: "" },
  { id: "s5", num: "S5", title: "Research Involving Human Participants", leadIds: JSON.stringify(["pallavi", "hybunna", "rhea"]), roleNote: "Draft", dueDate: "13 Jun", status: "not_started", progress: 0, notes: "" },
  { id: "s6", num: "S6", title: "Research Involving Animals", leadIds: JSON.stringify(["kendo"]), roleNote: "Consortium-wide ownership — not applicable; project management confirms in portal", dueDate: "23 May", status: "not_started", progress: 0, notes: "" },
  { id: "s7", num: "S7", title: "Research Management & Infrastructure", leadIds: JSON.stringify(["santhad", "aida", "ko", "kendo"]), roleNote: "Draft (coordination team suggested)", dueDate: "6 Jun", status: "not_started", progress: 0, notes: "" },
  { id: "s8", num: "S8", title: "Research Outputs Management & Sharing", leadIds: JSON.stringify(["pallavi", "ploy", "okka", "aida"]), roleNote: "Draft", dueDate: "13 Jun", status: "not_started", progress: 0, notes: "" },
  { id: "s9", num: "S9", title: "Research Training & Development", leadIds: JSON.stringify(["ploy", "okka", "aida", "hybunna"]), roleNote: "Draft (training lead suggested)", dueDate: "13 Jun", status: "not_started", progress: 0, notes: "" },
  { id: "s10", num: "S10", title: "Timetable & Milestones", leadIds: JSON.stringify(["kendo", "janin"]), roleNote: "All organizations send milestones; coordination team builds Gantt; project management reviews", dueDate: "17 Jun", status: "not_started", progress: 0, notes: "" },
  { id: "s11", num: "S11", title: "Consortium Budget Overview", leadIds: JSON.stringify(["kendo", "ploy", "pallavi", "okka", "rhea", "hybunna", "aida"]), roleNote: "Each organization fills CM sheet; project management consolidates", dueDate: "13 Jun", status: "not_started", progress: 0, notes: "" },
  { id: "s12", num: "S12", title: "Co-Funding", leadIds: JSON.stringify(["kendo", "janin"]), roleNote: "Draft", dueDate: "30 May", status: "not_started", progress: 0, notes: "" },
  { id: "s13", num: "S13", title: "MEL — Theory of Change & Logframe", leadIds: JSON.stringify(["pallavi", "janin", "kendo", "aida", "ko", "okka", "rhea"]), roleNote: "AIT: ToC narrative + Logframe; coordination team: diagram + compile; project management: GEDI", dueDate: "17 Jun", status: "not_started", progress: 0, notes: "" },
  { id: "s14", num: "S14", title: "Public & Policy Engagement", leadIds: JSON.stringify(["okka", "rhea", "aida"]), roleNote: "Draft (engagement lead suggested)", dueDate: "6 Jun", status: "not_started", progress: 0, notes: "" },
  { id: "s15", num: "S15", title: "Project Risk Evaluation", leadIds: JSON.stringify(["pallavi", "kendo", "janin", "ko", "ploy"]), roleNote: "AIT: data/tech risks; RecyGlo: field risks; coordination team: compile; project management: financial", dueDate: "17 Jun", status: "not_started", progress: 0, notes: "" },
  { id: "s16", num: "S16", title: "Environmental Sustainability", leadIds: JSON.stringify(["okka", "janin", "ko", "kendo"]), roleNote: "Draft (coordination lead suggested)", dueDate: "6 Jun", status: "not_started", progress: 0, notes: "" },
  { id: "s17", num: "S17", title: "Reviewer Suggestions", leadIds: JSON.stringify(["ploy"]), roleNote: "Optional — PI enters directly in portal", dueDate: "13 Jun", status: "not_started", progress: 0, notes: "" },
  { id: "s18", num: "S18", title: "Eligibility & Consortium Org Chart", leadIds: JSON.stringify(["santhad", "janin", "kendo"]), roleNote: "Coordination team completes in portal and uploads org chart; project management drafts S18 eligibility", dueDate: "30 May", status: "not_started", progress: 0, notes: "" },
  { id: "s19", num: "S19", title: "E-Signature (PI)", leadIds: JSON.stringify(["ploy"]), roleNote: "PI signs after Research Office approval — final step", dueDate: "9 Jul", status: "not_started", progress: 0, notes: "" },
];

const DOCUMENTS = [
  { id: "d1", docNum: "1", title: "LoS — PI Dr. Ploypailin (institutional, from KMITL)", sectionRef: "S2", responsibleId: "ploy", status: "verified", statusNote: "Exists (institutional letter)", dueDate: "22 May" },
  { id: "d2", docNum: "2", title: "LoS — Deputy PI Santhad (institutional, from KMITL)", sectionRef: "S2", responsibleId: "santhad", status: "unverified", statusNote: "Unverified (image PDF)", dueDate: "22 May" },
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
      { id: "p1t5", ownerId: "kendo", text: "Send LoS templates to partner organizations and verify existing institutional letters", done: false },
    ]),
  },
  {
    id: "p2a",
    num: "Phase 2a",
    dates: "20–22 May",
    name: "Pre-departure Preparation",
    color: "#2E75B6",
    tasks: JSON.stringify([
      { id: "p2at1", ownerId: "kendo", text: "Complete S1 verification; draft S12 co-funding; begin S18 eligibility — finish all ERTH-only drafting before departure", done: false },
      { id: "p2at2", ownerId: "kendo", text: "Prepare handover doc for Janin: shared folder structure, chase list, portal login instructions", done: false },
      { id: "p2at3", ownerId: "kendo", text: "Send budget CM sheets to all orgs with hard deadline: 23 May (before departure)", done: false },
      { id: "p2at4", ownerId: "ploy", text: "Submit S2 profile and S4 framing draft to the coordination channel by 22 May", done: false },
      { id: "p2at5", ownerId: "janin", text: "Collect all pending LoS files and profiles by 22 May and place them in the shared coordination folder", done: false },
    ]),
  },
  {
    id: "p2b",
    num: "Phase 2b",
    dates: "23–24 May",
    name: "Coordination Window",
    color: "#7D6608",
    tasks: JSON.stringify([
      { id: "p2bt1", ownerId: "janin", text: "Take over admin coordination — receive all incoming drafts, LoS letters, and budget CM sheets", done: false },
      { id: "p2bt2", ownerId: "janin", text: "Finalize S7, S9, S14, and S16 drafts and submit them to the coordination channel by 24 May", done: false },
      { id: "p2bt3", ownerId: "pallavi", text: "Submit S3 inputs, S4 methodology, S5, S8, and references by 24 May", done: false },
      { id: "p2bt4", ownerId: "janin", text: "Follow up on missing inputs (budget sheets, profiles, LoS letters) and escalate blockers through the decision channel", done: false },
      { id: "p2bt5", ownerId: "kendo", text: "Available for urgent decisions only — WhatsApp/email. Not for drafting.", done: false },
    ]),
  },
  {
    id: "p3",
    num: "Phase 3",
    dates: "25–27 May",
    name: "Hard Gate — Submission Readiness",
    color: "#CA6F1E",
    tasks: JSON.stringify([
      { id: "p3t1", ownerId: "janin", text: "Confirm all CM budget sheets are received (due 23 May) and flag any missing items to the decision channel immediately", done: false },
      { id: "p3t2", ownerId: "kendo", text: "Review and approve consolidated budget figures by 27 May", done: false },
      { id: "p3t3", ownerId: "janin", text: "Collect all org milestone inputs; build Gantt in Excel template (S10)", done: false },
      { id: "p3t4", ownerId: "janin", text: "Integrate S3 org inputs into coherent narrative; enter in portal", done: false },
      { id: "p3t5", ownerId: "pallavi", text: "Submit S13 ToC narrative + logframe and S15 data/tech/IRB risk inputs by 26 May", done: false },
      { id: "p3t6", ownerId: "okka", text: "Submit S15 field and operational risk inputs by 26 May", done: false },
      { id: "p3t7", ownerId: "janin", text: "Integrate the full S4 draft in the portal by 27 May", done: false },
    ]),
  },
  {
    id: "p4",
    num: "Phase 4",
    dates: "28–30 May",
    name: "Integration and Packaging",
    color: "#17A589",
    tasks: JSON.stringify([
      { id: "p4t1", ownerId: "janin", text: "Enter all drafted sections into portal; upload all collected documents", done: false },
      { id: "p4t2", ownerId: "janin", text: "S13: compile AIT's ToC narrative + Logframe; commission and produce ToC flow diagram (PowerPoint → PDF)", done: false },
      { id: "p4t3", ownerId: "janin", text: "S15: compile AIT + RecyGlo risk inputs into single register; export as 15_ProjectRisk_RiskRegister.pdf", done: false },
      { id: "p4t4", ownerId: "janin", text: "S18: complete eligibility info in portal; upload consortium org chart", done: false },
      { id: "p4t5", ownerId: "kendo", text: "Review integrated portal draft end of 30 May; confirm S11 budget narrative is accurate; add financial risks to S15", done: false },
      { id: "p4t6", ownerId: "ploy", text: "Run full S2 profile validation and flag any data-entry errors in the coordination channel", done: false },
    ]),
  },
  {
    id: "p5",
    num: "Phase 5",
    dates: "2–4 Jun",
    name: "Internal Review",
    color: "#6C3483",
    tasks: JSON.stringify([
      { id: "p5t1", ownerId: "ploy", text: "Review the full integrated portal draft and provide consolidated comments by 3 Jun", done: false },
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
      { id: "p6t3", ownerId: "kmitl_ro", text: "Give formal approval in portal to unlock the PI e-signature step", done: false },
      { id: "p6t4", ownerId: "kendo", text: "⚠ Critical path: RO approval is the single biggest delay risk. RO must be in the portal by 19 May.", done: false },
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
      { id: "p7t3", ownerId: "kendo", text: "🎯 Portal deadline: 10 June 2026 — submit by 9 June to have buffer", done: false },
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
