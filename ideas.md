# ACHIEVE-SEA Dashboard — Design Brainstorm

## Context
An internal research grant submission tracking dashboard for a multi-organization consortium (KMITL, ERTH, AIT, RecyGlo, UPLB/PNC). Primary users are project managers and researchers coordinating a complex grant application with a hard deadline.

---

<response>
<idea>
**Design Movement:** Neo-Institutional / Data Command Center
**Core Principles:**
1. Information density without visual noise — every pixel earns its place
2. Status at a glance — color-coded org identity system persists across all views
3. Authoritative hierarchy — navy anchors trust, accent colors signal urgency
4. Sidebar-first navigation — persistent left panel for quick context switching

**Color Philosophy:** Deep navy (#1A2744) as the command surface, off-white (#F7F8FA) for content areas. Six distinct org colors (navy, teal, blue, green, orange, red) serve as identity tokens — not decorative, but functional. Urgency escalates through amber → red.

**Layout Paradigm:** Left sidebar (240px fixed) + main content area. Header bar shows grant metadata. Content uses a 3-column stat row + full-width table pattern. No centered hero sections.

**Signature Elements:**
- Org color pills that appear consistently across all tables and timeline views
- Progress rings on the overview cards (SVG circular progress)
- Sticky deadline countdown in the header

**Interaction Philosophy:** Inline editing — click a status badge to cycle through states. Click an owner pill to open a reassignment popover. No page navigations for simple updates.

**Animation:** Status badge transitions at 150ms ease-out. Table row hover lifts with subtle shadow. Progress bars animate on mount with 600ms ease-out.

**Typography System:** IBM Plex Sans (headings, bold, institutional feel) + Inter (body, data). Section numbers in monospace (IBM Plex Mono) for technical precision.
</idea>
<probability>0.08</probability>
</response>

<response>
<idea>
**Design Movement:** Brutalist Utility / Tactical Operations Board
**Core Principles:**
1. Raw function — no decorative elements, only structural ones
2. High contrast for fast scanning under pressure
3. Grid-locked layout — everything snaps to a strict 8px grid
4. Typography as hierarchy — weight and size do all the work

**Color Philosophy:** Near-black (#0F1117) background, stark white text, single accent color (electric teal #00D4AA) for interactive elements. Org colors remain vivid against dark backgrounds.

**Layout Paradigm:** Full-width dark header, two-column split (narrow left status rail + wide right content). Tables use zebra striping with high contrast.

**Signature Elements:**
- Monospace section numbers in large type
- Horizontal status bars that fill left-to-right as tasks complete
- Keyboard shortcut hints on interactive elements

**Interaction Philosophy:** Power-user focused — bulk status updates, keyboard navigation, filter by org.

**Animation:** Minimal — only progress fills animate. Everything else is instant.

**Typography System:** Space Grotesk (headings) + JetBrains Mono (data/numbers). All caps for section labels.
</idea>
<probability>0.06</probability>
</response>

<response>
<idea>
**Design Movement:** Academic Research Portal / Refined Institutional
**Core Principles:**
1. Calm authority — the design should feel like a well-run research institution
2. Layered information — progressive disclosure, expandable rows
3. Warm neutrals soften the bureaucratic edge
4. Asymmetric sidebar layout with card-based content zones

**Color Philosophy:** Warm slate (#2C3E50) for structure, cream (#FAFAF8) for content, sage green (#4A7C59) as the primary action color. Org colors are muted/pastel variants for a cohesive palette.

**Layout Paradigm:** Left sidebar (220px) with section navigation + right content with card grid. Overview uses a 2x2 stat card layout with embedded mini-charts.

**Signature Elements:**
- Expandable section rows that reveal notes and sub-tasks inline
- Org avatar clusters showing who's involved in each section
- Gantt-style mini timeline in the header

**Interaction Philosophy:** Contextual — hover reveals quick actions (reassign, update status, add note). Modals for complex edits.

**Animation:** Smooth accordion expansions (250ms). Card entrance stagger on tab switch.

**Typography System:** Playfair Display (section headings, adds gravitas) + Source Sans Pro (body). Tabular numbers for dates and counts.
</idea>
<probability>0.07</probability>
</response>

---

## Selected Design: Neo-Institutional / Data Command Center

**Rationale:** This approach best serves the primary use case — a team under deadline pressure needs to scan status at a glance, update tasks inline, and reassign owners without friction. The sidebar-first layout supports the 4-tab structure (Overview, Sections, Documents, Timeline) while keeping grant metadata always visible. The org color system from the original file is preserved and elevated.
