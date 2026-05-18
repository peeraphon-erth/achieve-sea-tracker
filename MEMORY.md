# MEMORY — Resume After MCP Restart

## What was completed

Implemented step 4 (add/remove team members with forced reassignment) and most of step 5 wiring in app code.

### Code changes already done

- `client/src/hooks/useSupabaseSync.ts`
  - `SyncState` now includes `teamMembers`.
  - Fetch now includes `team_members` table.
  - Realtime subscription added for `team_members`.
  - Added helpers:
    - `insertTeamMemberInSupabase`
    - `updateTeamMemberInSupabase`
    - `deleteTeamMemberInSupabase`

- `client/src/contexts/SupabaseTrackerContext.tsx`
  - Sync handler now hydrates `teamMembers` from Supabase state.
  - `updateTeamMember` now persists to Supabase with rollback on error.
  - Added context APIs:
    - `addTeamMember(member)`
    - `validateMemberRemoval(id)`
    - `removeTeamMember(id, reassignToId)`
  - Removal flow reassigns all references before deletion:
    - `sections.leadIds`
    - `documents.responsibleId`
    - `phases.tasks[].ownerId`

- `client/src/components/TeamTab.tsx`
  - Added "Add Team Member" form (id, name, initials, role, org).
  - Added per-member "Remove" button.
  - Added forced reassignment panel before delete.
  - Confirm action performs reassign + remove.

- `seed-data.sql`
  - Added `DELETE FROM team_members;`
  - Added `INSERT INTO team_members (...)` seed data.

### Build status

- `npm run build` passes.
- Existing warnings (pre-existing): duplicate `scripts` key in `package.json`, missing analytics env vars in `index.html`.

## Why DB changes were blocked

Supabase MCP was configured with `--read-only`, so DDL failed (`CREATE TABLE` blocked).

User updated config to remove `--read-only`; next action is to continue after restart.

## First actions after restart

1. Confirm Supabase MCP is writable by running a small DDL test.
2. Create `public.team_members` table and index.
3. Validate table exists.
4. Run/verify seed insert for `team_members`.
5. Live test in app: edit org (e.g., Santhad -> KMITL), refresh, ensure persistence.
6. Live test forced reassignment remove flow.
7. Optionally check security advisors and report RLS status.

## SQL to run immediately after restart

```sql
create table if not exists public.team_members (
  id text primary key,
  name text not null,
  org text not null,
  role text not null,
  initials text not null,
  created_at timestamp without time zone default now(),
  updated_at timestamp without time zone default now()
);

create index if not exists team_members_org_idx on public.team_members(org);
```

## Quick verification SQL

```sql
select id, name, org, role, initials from public.team_members order by id;
```

## Important outstanding advisory

Supabase advisor previously reported critical RLS disabled on:

- `public.sections`
- `public.documents`
- `public.phases`

Need to surface this again after restart and decide policy setup before enabling RLS.

## Suggested immediate MCP commands after restart

1. `supabase_execute_sql` with table creation SQL above.
2. `supabase_list_tables` (verbose) to confirm `public.team_members`.
3. `supabase_execute_sql` to verify rows in `team_members`.
4. `supabase_get_advisors` (`security`) to re-check advisories.
