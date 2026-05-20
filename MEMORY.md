# MEMORY — Current Session Snapshot

## Completed this session

- Supabase connection and persistence were fixed locally; user confirmed persistence test passed.
- `public.team_members` table was created and seeded on Supabase project `iecxnthkbewgzzdjepqv`.
- Team/org model was refactored to organization entities only.
- Timeline phases were refactored to relative windows and delivery-flow naming.
- Timeline ordering bug was fixed with deterministic phase sorting.

## Supabase actions executed

- Created table and index:
  - `public.team_members`
  - `team_members_org_idx`
- Seeded `team_members` rows from `seed-data.sql` and verified query results.
- Data cleanup/migration applied:
  - removed pseudo-member `all`
  - set `hybunna` org to `pnc`
  - set `santhad` org to `kmitl`
  - updated `documents.d2` title to KMITL wording
  - replaced section lead/task references that used `all`
  - updated phase names, phase dates (`D-*` windows), and task wording to new timeline model
  - updated section `roleNote` wording to remove personal names

## Important advisory still open

Supabase security advisor reports critical `RLS disabled` on public tables:

- `public.sections`
- `public.documents`
- `public.phases`
- `public.team_members`

RLS was intentionally postponed to next sprint.

## Code changes made

- `client/src/hooks/useSupabaseSync.ts`
  - includes `teamMembers` in sync state
  - subscribes to `team_members`
  - deterministic sort for phases by ID order (`p1`, `p2a`, `p2b`, `p3`, `p4`, `p5`, `p6`, `p7`)
  - helper methods for team member insert/update/delete

- `client/src/contexts/SupabaseTrackerContext.tsx`
  - hydrates `teamMembers` from Supabase
  - add/update/remove team member APIs with rollback-safe behavior
  - forced reassignment flow updates `sections`, `documents`, and `phases` refs before delete

- `client/src/components/TeamTab.tsx`
  - org list includes `pnc`
  - add/remove member UI and forced reassignment flow

- `client/src/components/SectionsTab.tsx`
  - org filter includes `pnc`

- `client/src/components/OverviewTab.tsx`
  - org list includes `pnc`

- `client/src/pages/Home.tsx`
  - org legend includes `pnc`

- `client/src/components/TrackerUI.tsx`
  - org pill now renders pure organization labels

- `client/src/components/TimelineTab.tsx`
  - defensive local phase sorting before render

- `client/src/lib/data.ts`
  - `OrgId` changed to: `kmitl | erth | recyglo | ait | pnc | uplb`
  - removed org pseudo-member `all`
  - org labels normalized to organization names only
  - `INITIAL_SECTIONS`/`INITIAL_DOCUMENTS`/`INITIAL_PHASES` content updated for consistency
  - phase names and dates switched to relative windows:
    - `p1` `D-35 to D-30` Initiation & Access Readiness
    - `p2a` `D-29 to D-26` Inputs Collection I
    - `p2b` `D-25 to D-22` Inputs Collection II & Triage
    - `p3` `D-21 to D-14` Core Drafting
    - `p4` `D-13 to D-9` Integration & Consistency
    - `p5` `D-8 to D-6` Internal QA & Revision
    - `p6` `D-5 to D-3` Institutional Approval Gate
    - `p7` `D-2 to D-1` Submission & Confirmation

- `seed-data.sql`
  - aligned with org/timeline refactor (no `all`, `hybunna=pnc`, `santhad=kmitl`, updated text)

- `seed-supabase.mjs`
  - aligned with org/timeline refactor (no `all`, updated section/phase wording)

## Build status

- `npm run build` passes after all edits.
- Known pre-existing warnings remain:
  - duplicate `scripts` key warning in `package.json`
  - missing `%VITE_ANALYTICS_ENDPOINT%` and `%VITE_ANALYTICS_WEBSITE_ID%` in `index.html`

## Current known follow-ups

1. Decide final absolute deadline source and map `D-*` phase windows to concrete dates in UI.
2. Implement RLS policies for public tables in next sprint.

## Notes/comments UX fix (completed)

- The notes/status-note typing jitter issue was fixed by switching from per-keystroke realtime persistence to explicit submit.
- `client/src/components/SectionsTab.tsx`
  - section notes now use local draft state
  - added `Save` and `Cancel` actions
  - added unsaved indicator
  - keyboard shortcuts: `Cmd/Ctrl+Enter` to save, `Esc` to cancel
- `client/src/components/DocumentsTab.tsx`
  - document status notes now use local draft state
  - added `Save` and `Cancel` actions
  - added unsaved indicator
  - keyboard shortcuts: `Cmd/Ctrl+Enter` to save, `Esc` to cancel
- Behavior now: notes sync to Supabase only on save (not while typing), reducing realtime rehydrate interference.
- User validated this fix and confirmed it works.
