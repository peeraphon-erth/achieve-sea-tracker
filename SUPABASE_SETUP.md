# Supabase Real-time Sync Setup Guide

This dashboard now supports **real-time multi-user collaboration** via Supabase. All team members see updates instantly across their browsers.

## Quick Start

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up (free tier available)
2. Create a new project (choose any region)
3. Wait for the project to initialize (~2 minutes)

### 2. Create Database Tables

In the Supabase dashboard, go to **SQL Editor** and run this script:

```sql
-- Sections table
CREATE TABLE sections (
  id TEXT PRIMARY KEY,
  num TEXT NOT NULL,
  title TEXT NOT NULL,
  leadIds TEXT[] NOT NULL,
  roleNote TEXT,
  dueDate TEXT NOT NULL,
  status TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  docNum TEXT NOT NULL,
  title TEXT NOT NULL,
  sectionRef TEXT NOT NULL,
  responsibleId TEXT NOT NULL,
  dueDate TEXT NOT NULL,
  status TEXT NOT NULL,
  statusNote TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Phases table
CREATE TABLE phases (
  id TEXT PRIMARY KEY,
  num TEXT NOT NULL,
  name TEXT NOT NULL,
  dates TEXT NOT NULL,
  color TEXT NOT NULL,
  tasks JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE sections;
ALTER PUBLICATION supabase_realtime ADD TABLE documents;
ALTER PUBLICATION supabase_realtime ADD TABLE phases;
```

### 3. Get Your Credentials

1. Go to **Settings → API** in Supabase dashboard
2. Copy your:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Anon Public Key** (starts with `eyJ...`)

### 4. Add Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Replace with your actual values from step 3.

### 5. Seed Initial Data (Optional)

To populate the database with the initial tracker data, run this in the Supabase SQL Editor:

```sql
-- Insert sections (19 total)
INSERT INTO sections (id, num, title, leadIds, roleNote, dueDate, status, progress, notes) VALUES
('s1', 'S1', 'Application Summary', ARRAY['kendo'], 'Verify carry-over data', '20 May', 'not_started', 0, ''),
('s2', 'S2', 'Applicant Details (all profiles)', ARRAY['all_orgs'], 'Each writes own profile; Kendo compiles', '22 May', 'not_started', 0, ''),
-- ... add remaining sections ...
;

-- Insert documents (15 total)
INSERT INTO documents (id, docNum, title, sectionRef, responsibleId, dueDate, status, statusNote) VALUES
('d1', 'D1', 'Letter of Support — KMITL', 's1', 'ploy', '15 May', 'missing', ''),
('d2', 'D2', 'Letter of Support — ERTH/Kendo', 's1', 'kendo', '15 May', 'missing', ''),
-- ... add remaining documents ...
;

-- Insert phases
INSERT INTO phases (id, num, name, dates, color, tasks) VALUES
('p1', '1', 'Data Gathering & Compilation', '15–22 May', '#2E75B6', '[...]'),
-- ... add remaining phases ...
;
```

### 6. Test the Connection

1. Start the dev server: `pnpm dev`
2. Open the app in your browser
3. You should see a green **"Live"** indicator in the top-right header
4. Make a change (e.g., update a section status)
5. Open the app in a second browser tab/window
6. The change should appear instantly in the second tab

## Troubleshooting

### "Offline" indicator shows but I'm online
- Check your `.env.local` file has the correct credentials
- Verify Supabase project is running (check dashboard)
- Check browser console for errors (F12 → Console tab)

### Changes don't sync across tabs
- Ensure Realtime is enabled for all tables (step 2)
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly
- Verify Row Level Security (RLS) is disabled on tables (Settings → RLS in Supabase)

### "Syncing…" indicator never goes away
- This is normal during the first sync after startup
- If it persists >5 seconds, check network tab in browser DevTools (F12 → Network)

## Data Structure

### Sections
- `id`: Unique identifier (e.g., "s1")
- `num`: Display number (e.g., "S1")
- `title`: Section title
- `leadIds`: Array of team member IDs assigned as lead drafters
- `status`: "not_started" | "in_progress" | "review" | "blocked" | "complete"
- `progress`: 0–100 percentage
- `notes`: Free-form notes field

### Documents
- `id`: Unique identifier (e.g., "d1")
- `docNum`: Display number (e.g., "D1")
- `responsibleId`: Single team member ID
- `status`: "missing" | "unverified" | "verified" | "na"
- `statusNote`: Free-form note

### Phases
- `tasks`: Array of task objects with `id`, `text`, `ownerId`, `done` boolean

## Offline Support

The app automatically falls back to localStorage when offline. Changes sync to Supabase when you reconnect.

## Performance Notes

- Real-time updates are instant for <100 concurrent users
- If you have >50 team members, consider adding Row Level Security (RLS) policies
- Free tier supports up to 500MB storage and 2GB bandwidth/month

---

For more help, see [Supabase docs](https://supabase.com/docs) or contact support.
