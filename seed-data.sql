-- ACHIEVE-SEA Tracker — Seed Data (with cleanup)
-- Run this in Supabase SQL Editor to clear and populate all tables

-- ─── Clear existing data ──────────────────────────────────────────────────

DELETE FROM phases;
DELETE FROM documents;
DELETE FROM sections;
DELETE FROM team_members;

-- ─── Team Members (13 total) ───────────────────────────────────────────────

INSERT INTO team_members (id, name, org, role, initials) VALUES
('ploy', 'Dr. Ploypailin', 'kmitl', 'PI / Lead', 'PY'),
('kendo', 'Kendo', 'erth', 'Project Manager', 'KE'),
('pallavi', 'Pallavi', 'ait', 'Co-PI (AIT)', 'PA'),
('voravate', 'Voravate', 'ait', 'Co-PI (AIT)', 'VO'),
('okka', 'Okka', 'recyglo', 'Co-PI (RecyGlo)', 'OK'),
('janin', 'Janin', 'recyglo', 'Portal Coordinator', 'JA'),
('ko', 'Ko', 'recyglo', 'RecyGlo Team', 'KO'),
('aida', 'Aida', 'recyglo', 'RecyGlo Team', 'AI'),
('rhea', 'Rhea', 'uplb', 'Co-PI (UPLB)', 'RH'),
('hybunna', 'Hybunna', 'pnc', 'Co-PI (PNC Cambodia)', 'HY'),
('santhad', 'Santhad', 'kmitl', 'Deputy PI', 'SA'),
('kmitl_ro', 'KMITL RO', 'kmitl', 'Research Office', 'RO');

-- ─── Sections (19 total) ──────────────────────────────────────────────────

INSERT INTO sections (id, num, title, leadIds, roleNote, dueDate, status, progress, notes) VALUES
('s1', 'S1', 'Application Summary', ARRAY['kendo'], 'Verify carry-over data', '20 May', 'not_started', 0, ''),
('s2', 'S2', 'Applicant Details (all profiles)', ARRAY['kendo'], 'Consortium-wide ownership: each organization writes its own profile; project management compiles', '22 May', 'not_started', 0, ''),
('s3', 'S3', 'Consortium Collaborations', ARRAY['janin'], 'All organizations contribute 150-200 words; coordination team edits and enters in portal', '27 May', 'not_started', 0, ''),
('s4', 'S4', 'Research Proposal', ARRAY['pallavi','ploy'], 'Lead institution provides framing; AIT provides methodology; ERTH provides structure', '27 May', 'not_started', 0, ''),
('s5', 'S5', 'Research Involving Human Participants', ARRAY['pallavi'], 'Draft', '24 May', 'not_started', 0, ''),
('s6', 'S6', 'Research Involving Animals', ARRAY['kendo'], 'Consortium-wide ownership — not applicable; project management confirms in portal', '20 May', 'not_started', 0, ''),
('s7', 'S7', 'Research Management & Infrastructure', ARRAY['janin','ko'], 'Draft (coordination team suggested)', '24 May', 'not_started', 0, ''),
('s8', 'S8', 'Research Outputs Management & Sharing', ARRAY['pallavi'], 'Draft', '24 May', 'not_started', 0, ''),
('s9', 'S9', 'Research Training & Development', ARRAY['aida'], 'Draft (training lead suggested)', '24 May', 'not_started', 0, ''),
('s10', 'S10', 'Timetable & Milestones', ARRAY['janin'], 'All organizations send milestones; coordination team builds Gantt; project management reviews', '27 May', 'not_started', 0, ''),
('s11', 'S11', 'Consortium Budget Overview', ARRAY['kendo'], 'Each organization fills CM sheet; project management consolidates', '27 May', 'not_started', 0, ''),
('s12', 'S12', 'Co-Funding', ARRAY['kendo'], 'Draft', '27 May', 'not_started', 0, ''),
('s13', 'S13', 'MEL — Theory of Change & Logframe', ARRAY['pallavi','janin'], 'AIT: ToC narrative + Logframe; coordination team: diagram + compile; project management: GEDI', '30 May', 'not_started', 0, ''),
('s14', 'S14', 'Public & Policy Engagement', ARRAY['okka','ko'], 'Draft (engagement lead suggested)', '24 May', 'not_started', 0, ''),
('s15', 'S15', 'Project Risk Evaluation', ARRAY['pallavi','okka','janin'], 'AIT: data/tech risks; RecyGlo: field risks; coordination team: compile; project management: financial', '30 May', 'not_started', 0, ''),
('s16', 'S16', 'Environmental Sustainability', ARRAY['janin'], 'Draft (coordination lead suggested)', '24 May', 'not_started', 0, ''),
('s17', 'S17', 'Reviewer Suggestions', ARRAY['ploy'], 'Optional — PI enters directly in portal', '5 Jun', 'not_started', 0, ''),
('s18', 'S18', 'Eligibility & Consortium Org Chart', ARRAY['janin','kendo'], 'Coordination team completes in portal and uploads org chart; project management drafts S18 eligibility', '30 May', 'not_started', 0, ''),
('s19', 'S19', 'E-Signature (PI)', ARRAY['ploy'], 'PI signs after Research Office approval — final step', '9 Jun', 'not_started', 0, '');

-- ─── Documents (15 total) ────────────────────────────────────────────────

INSERT INTO documents (id, docNum, title, sectionRef, responsibleId, dueDate, status, statusNote) VALUES
('d1', '1', 'LoS — PI Dr. Ploypailin (institutional, from KMITL)', 'S2', 'ploy', '22 May', 'verified', 'Exists (institutional letter)'),
('d2', '2', 'LoS — Deputy PI Santhad (institutional, from KMITL)', 'S2', 'santhad', '22 May', 'unverified', 'Unverified (image PDF)'),
('d3a', '3a', 'LoS — Co-PI Pallavi (from AIT)', 'S2', 'pallavi', '22 May', 'unverified', 'Unverified (image PDF)'),
('d3b', '3b', 'LoS — Co-PI Okka (from RecyGlo)', 'S2', 'okka', '22 May', 'unverified', 'Unverified (image PDF)'),
('d3c', '3c', 'LoS — Co-PI Hybunna (from PNC Cambodia)', 'S2', 'hybunna', '22 May', 'missing', 'REWRITE REQUIRED (wrong addressee)'),
('d3d', '3d', 'LoS — Co-PI Rhea (institutional, from UPLB)', 'S2', 'rhea', '22 May', 'missing', 'MISSING (personal letter only)'),
('d4', '4', 'Figures / Additional Info (max 2 A4 pages)', 'S4', 'kendo', '27 May', 'missing', 'To prepare'),
('d5', '5', 'References (max 2 A4 pages, APA 7th)', 'S4', 'kendo', '27 May', 'missing', 'To prepare'),
('d6', '6', 'NC3Rs ARRIVE checklist (if applicable)', 'S6', 'kendo', '20 May', 'unverified', 'Likely N/A — confirm'),
('d7', '7', 'Sample size justification PDF (optional)', 'S6', 'kendo', '27 May', 'unverified', 'Check if needed'),
('d8', '8', 'Research management / staffing diagram', 'S7', 'kendo', '24 May', 'missing', 'To prepare'),
('d9', '9', 'Gantt Chart (SEA DREAM template)', 'S10', 'kendo', '27 May', 'missing', 'To build'),
('d10', '10', 'Full Application Budget Template (USD, mandatory)', 'S11', 'janin', '27 May', 'missing', 'CM sheets due 23 May'),
('d11', '11', 'Overhead Justification Letter (if applicable)', 'S11', 'ploy', '27 May', 'unverified', 'Confirm with KMITL RO'),
('d12', '12', 'Co-Funding documents (if applicable)', 'S12', 'kendo', '27 May', 'unverified', 'TBD'),
('d13', '13', 'Theory of Change diagram (13_MEL_TOC.pdf)', 'S13', 'kendo', '30 May', 'missing', 'To prepare'),
('d14', '14', 'Logical Framework (13_MEL_Logframe.pdf)', 'S13', 'kendo', '30 May', 'missing', 'To prepare'),
('d15', '15', 'Risk Register (15_ProjectRisk_RiskRegister.pdf)', 'S15', 'janin', '30 May', 'missing', 'To prepare');

-- ─── Phases (7 total) ────────────────────────────────────────────────────

INSERT INTO phases (id, num, name, dates, color, tasks) VALUES
('p1', 'Phase 1', 'Kickoff', '16–19 May', '#1F3864', '[{"id":"p1t1","ownerId":"ploy","text":"Accept shortlist invitation in grants.sea-dream.org portal","done":false},{"id":"p1t2","ownerId":"ploy","text":"Invite KMITL Research Office (RO) to portal — critical path dependency","done":false},{"id":"p1t3","ownerId":"kendo","text":"Share task briefs with all team members; send budget Excel template to each org lead","done":false},{"id":"p1t4","ownerId":"kendo","text":"Email SEA DREAM re: AIT country classification (Thailand vs. regional)","done":false},{"id":"p1t5","ownerId":"kendo","text":"Send LoS templates to Hybunna (PNC) and Rhea (UPLB); verify AIT + RecyGlo existing letters","done":false}]'::jsonb),
('p2a', 'Phase 2a', 'Kendo — Pre-departure', '20–22 May', '#2E75B6', '[{"id":"p2at1","ownerId":"kendo","text":"Complete S1 verification; draft S12 co-funding; begin S18 eligibility — finish all ERTH-only drafting before departure","done":false},{"id":"p2at2","ownerId":"kendo","text":"Prepare handover doc for Janin: shared folder structure, chase list, portal login instructions","done":false},{"id":"p2at3","ownerId":"kendo","text":"Send budget CM sheets to all orgs with hard deadline: 23 May (before departure)","done":false},{"id":"p2at4","ownerId":"ploy","text":"S2 profile + S4 framing → to Janin by 22 May","done":false},{"id":"p2at5","ownerId":"janin","text":"Rhea, Hybunna, Santhad: all LoS + profiles due 22 May — submit to Janin''s shared folder","done":false}]'::jsonb),
('p2b', 'Phase 2b', 'Janin Coordinates', '23–24 May', '#7D6608', '[{"id":"p2bt1","ownerId":"janin","text":"Take over admin coordination — receive all incoming drafts, LoS letters, and budget CM sheets","done":false},{"id":"p2bt2","ownerId":"janin","text":"S7 (Janin/Ko), S9 (Aida), S14 (Okka/Ko), S16 (Janin) — final drafts due to Janin by 24 May","done":false},{"id":"p2bt3","ownerId":"pallavi","text":"S3 input, S4 methodology, S5, S8, References — due to Janin by 24 May","done":false},{"id":"p2bt4","ownerId":"janin","text":"Chase any missing inputs (budget sheets, profiles, LoS letters) — escalate to Kendo async only if blocked","done":false},{"id":"p2bt5","ownerId":"kendo","text":"Available for urgent decisions only — WhatsApp/email. Not for drafting.","done":false}]'::jsonb),
('p3', 'Phase 3', 'Hard Gate — Janin Coordinates', '25–27 May', '#CA6F1E', '[{"id":"p3t1","ownerId":"janin","text":"Confirm all CM budget sheets received (due 23 May from orgs); flag any missing to Kendo async immediately","done":false},{"id":"p3t2","ownerId":"kendo","text":"Review and approve budget figures by 27 May — Janin collects, Kendo signs off numbers remotely","done":false},{"id":"p3t3","ownerId":"janin","text":"Collect all org milestone inputs; build Gantt in Excel template (S10)","done":false},{"id":"p3t4","ownerId":"janin","text":"Integrate S3 org inputs into coherent narrative; enter in portal","done":false},{"id":"p3t5","ownerId":"pallavi","text":"S13 ToC narrative + Logframe due 26 May → to Janin. S15 data/tech/IRB risks due 26 May → to Janin.","done":false},{"id":"p3t6","ownerId":"okka","text":"S15 field/operational risks due 26 May → to Janin","done":false},{"id":"p3t7","ownerId":"janin","text":"Integrate S4 full draft (Ploy framing + AIT methodology) in portal by 27 May","done":false}]'::jsonb),
('p4', 'Phase 4', 'Integration — Janin Coordinates', '28–30 May', '#17A589', '[{"id":"p4t1","ownerId":"janin","text":"Enter all drafted sections into portal; upload all collected documents","done":false},{"id":"p4t2","ownerId":"janin","text":"S13: compile AIT''s ToC narrative + Logframe; commission and produce ToC flow diagram (PowerPoint → PDF)","done":false},{"id":"p4t3","ownerId":"janin","text":"S15: compile AIT + RecyGlo risk inputs into single register; export as 15_ProjectRisk_RiskRegister.pdf","done":false},{"id":"p4t4","ownerId":"janin","text":"S18: complete eligibility info in portal; upload consortium org chart","done":false},{"id":"p4t5","ownerId":"kendo","text":"Review integrated portal draft end of 30 May; confirm S11 budget narrative is accurate; add financial risks to S15","done":false},{"id":"p4t6","ownerId":"ploy","text":"S2 full check: confirm all Co-PI profiles entered correctly; flag any errors to Janin","done":false}]'::jsonb),
('p5', 'Phase 5', 'Internal Review', '2–4 Jun', '#6C3483', '[{"id":"p5t1","ownerId":"ploy","text":"Review full integrated draft in portal; provide consolidated comments to Kendo by 3 Jun","done":false},{"id":"p5t2","ownerId":"santhad","text":"Review S2 profiles (Deputy PI focus)","done":false},{"id":"p5t3","ownerId":"kendo","text":"Implement all review comments; confirm S11 budget narrative final; application ready for RO by 5 Jun","done":false},{"id":"p5t4","ownerId":"ploy","text":"Enter S17 reviewer suggestions (optional)","done":false}]'::jsonb),
('p6', 'Phase 6', 'RO Gate', '5–7 Jun', '#C0392B', '[{"id":"p6t1","ownerId":"kmitl_ro","text":"Research Office reviews application in portal — budget, compliance, institutional commitments","done":false},{"id":"p6t2","ownerId":"kendo","text":"Address any RO comments immediately (same-day turnaround required)","done":false},{"id":"p6t3","ownerId":"kmitl_ro","text":"Give formal approval in portal — this unlocks Dr. Ploy''s e-signature step","done":false},{"id":"p6t4","ownerId":"kendo","text":"⚠ Critical path: RO approval is the single biggest delay risk. RO must be in the portal by 19 May.","done":false}]'::jsonb),
('p7', 'Phase 7', 'Submit', '8–9 Jun', '#1E8449', '[{"id":"p7t1","ownerId":"ploy","text":"Complete S19 e-signature in grants.sea-dream.org portal","done":false},{"id":"p7t2","ownerId":"kendo","text":"Confirm submission confirmation email received; retain copy of submitted application","done":false},{"id":"p7t3","ownerId":"kendo","text":"🎯 Portal deadline: 10 June 2026 — submit by 9 June to have buffer","done":false}]'::jsonb);
