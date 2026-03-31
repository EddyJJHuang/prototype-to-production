# VisaHire Design Specification v2

> **Design direction**: Refined professional — clean, trustworthy, data-forward.
> Linear meets Glassdoor. Empowering, never clinical.

---

## 1. Design Principles

1. **Sponsorship clarity is king.** The H-1B badge is the single most prominent visual element on every job card. Everything else serves it.
2. **Data earns trust.** Match scores, approval rates, salary ranges — surface numbers clearly, explain them on demand.
3. **Reduce anxiety, not information.** These are students under pressure. The UI should feel like a calm, organized workspace — never overwhelming, never hiding what matters.
4. **Density with breathing room.** Show enough to compare without scrolling endlessly, but never feel cramped. Think spreadsheet clarity, editorial whitespace.
5. **Progressive disclosure.** Card → detail → reasoning. Let users drill in at their own pace.

---

## 2. Typography

### Font Pairing

| Role | Font | Weights | Source |
|------|------|---------|--------|
| **Display / Headings** | **Plus Jakarta Sans** | 600, 700, 800 | Google Fonts |
| **Body / UI** | **DM Sans** | 400, 500, 600 | Google Fonts |
| **Monospace (data)** | **JetBrains Mono** | 400, 500 | Google Fonts |

### Why this pairing
- **Plus Jakarta Sans**: Geometric, confident, slightly warmer than Satoshi. Distinct enough to have character, neutral enough for a professional tool. The 800 weight carries metric values and page titles with authority.
- **DM Sans**: Clean geometric sans with open apertures — highly readable at small sizes (13–14px body). Pairs naturally with Jakarta without competing.
- **JetBrains Mono**: For salary ranges, percentages, petition counts — anywhere numbers need to be scannable and precisely aligned.

### Type Scale

| Token | Size | Weight | Font | Usage |
|-------|------|--------|------|-------|
| `display` | 28px / 1.75rem | Jakarta 800 | Plus Jakarta Sans | Page titles ("Dashboard", "Job Search") |
| `heading-lg` | 22px / 1.375rem | Jakarta 700 | Plus Jakarta Sans | Section headings ("Recommended Matches") |
| `heading-sm` | 16px / 1rem | Jakarta 600 | Plus Jakarta Sans | Card titles, job titles in list |
| `body` | 14px / 0.875rem | DM Sans 400 | DM Sans | Paragraphs, descriptions |
| `body-medium` | 14px / 0.875rem | DM Sans 500 | DM Sans | Labels, nav items, metadata |
| `caption` | 12px / 0.75rem | DM Sans 500 | DM Sans | Timestamps, helper text, badge text |
| `metric` | 32px / 2rem | Jakarta 800 | Plus Jakarta Sans | Dashboard metric values |
| `metric-sm` | 18px / 1.125rem | JetBrains Mono 500 | JetBrains Mono | Salary ranges, percentages |
| `mono` | 13px / 0.8125rem | JetBrains Mono 400 | JetBrains Mono | Data table numbers, counts |

### Line Heights
- Headings: 1.2 (tight)
- Body: 1.6 (relaxed, readable)
- Captions: 1.4
- Metrics: 1.0 (tight, numbers only)

### Letter Spacing
- Display/Headings: -0.025em (tight tracking for authority)
- Body: 0 (default)
- Captions/Labels: 0.01em (slightly open for legibility at small sizes)
- All-caps labels: 0.05em

---

## 3. Color System

### Philosophy
The palette separates **semantic colors** (sponsorship states, match scores) from **interactive colors** (buttons, links, focus). The primary interactive color is a deep indigo — distinct from all three badge states (green, amber, gray) so there's zero visual conflict.

### Core Palette

```
INTERACTIVE
  primary-600     #4F46E5   — Buttons, links, active nav, focus rings
  primary-700     #4338CA   — Hover state, pressed buttons
  primary-50      #EEF2FF   — Selected row bg, subtle highlights
  primary-100     #E0E7FF   — Active nav background (light mode)
  primary-900     #312E81   — Dark mode active nav background

SPONSORSHIP (Semantic — never used for generic UI)
  sponsor-green   #059669   — Confirmed H-1B sponsor (emerald-600)
  sponsor-green-bg #D1FAE5  — Badge background light (emerald-100)
  sponsor-green-border #A7F3D0 — Badge border light (emerald-200)
  sponsor-green-dark-bg rgba(5,150,105,0.15) — Badge bg dark mode

  sponsor-amber   #D97706   — Sometimes sponsors / unverified
  sponsor-amber-bg #FEF3C7  — Badge background light
  sponsor-amber-border #FDE68A — Badge border light

  sponsor-gray    #6B7280   — Unknown / no data
  sponsor-gray-bg #F3F4F6   — Badge background light
  sponsor-gray-border #E5E7EB — Badge border light

MATCH SCORES
  match-high      #16A34A   — ≥ 80% (green-600)
  match-mid       #D97706   — 60–79% (amber-600)
  match-low       #9CA3AF   — < 60% (gray-400)

SURFACE (Light)
  bg-page         #F8FAFC   — Page background (slate-50)
  bg-card         #FFFFFF   — Card surfaces
  bg-sidebar      #FFFFFF   — Sidebar background
  bg-hover        #F1F5F9   — Row hover, subtle highlight (slate-100)
  bg-selected     #EEF2FF   — Selected job in list (primary-50)

SURFACE (Dark)
  bg-page-dark    #0F172A   — Page background (slate-900)
  bg-card-dark    #1E293B   — Card surfaces (slate-800)
  bg-sidebar-dark #0F172A   — Sidebar background
  bg-hover-dark   #334155   — Row hover (slate-700)
  bg-selected-dark rgba(79,70,229,0.15) — Selected job in list

TEXT (Light)
  text-primary    #0F172A   — Headings, primary content (slate-900)
  text-secondary  #475569   — Body text (slate-600)
  text-tertiary   #94A3B8   — Metadata, timestamps (slate-400)

TEXT (Dark)
  text-primary-dark   #F1F5F9   — Headings (slate-100)
  text-secondary-dark #CBD5E1   — Body text (slate-300)
  text-tertiary-dark  #64748B   — Metadata (slate-500)

BORDER
  border-default  #E2E8F0   — Card borders, dividers (slate-200)
  border-dark     #334155   — Dark mode borders (slate-700)
  border-subtle   #F1F5F9   — Inner dividers (slate-100)

FEEDBACK
  success         #22C55E
  warning         #F59E0B
  error           #EF4444
  info            #3B82F6
```

### Contrast Ratios (WCAG AA minimum)
- `text-primary` on `bg-card`: 15.4:1 (AAA)
- `text-secondary` on `bg-card`: 7.1:1 (AAA)
- `text-tertiary` on `bg-card`: 3.5:1 (AA for large text, used only for non-essential metadata)
- `sponsor-green` on `sponsor-green-bg`: 4.8:1 (AA)
- `primary-600` on white: 5.7:1 (AA)

---

## 4. Sponsorship Badge Hierarchy

The sponsor badge is VisaHire's core differentiator. It must be the **first thing the eye sees** on every job card.

### Badge Variants

| State | Label | Visual Treatment |
|-------|-------|-----------------|
| **Confirmed** | `H-1B Sponsor` | Emerald bg, emerald border, bold emerald text, checkmark icon. Slightly larger than other badges (14px text, 6px vertical padding). Subtle left-side 3px solid border accent. |
| **Sometimes** | `May Sponsor` | Amber bg, amber border, amber text, question-mark icon. Same size as default badges. |
| **Unknown** | `Sponsorship Unknown` | Gray bg, gray border, gray text, help-circle icon. Smallest visual weight. |
| **No** | *(not shown)* | Jobs without sponsorship simply have no badge — absence communicates "no" without a negative label. |

### Badge Placement Rules
1. **Job card**: Top-right corner, before the save button. Visually breaks out of the card's content flow — sits in its own "lane."
2. **Job detail header**: Directly below job title, full width row. Largest badge size with icon.
3. **Job list (compact)**: Inline after company name, smaller variant.

### Why "most prominent"
- It's the only badge with a **border accent** (3px left bar on cards).
- It uses `font-weight: 700` while all other badges use 500.
- It gets `shadow-sm` — no other badge has shadow.
- On hover, the card's left border animates from transparent to `sponsor-green`.

---

## 5. Match Score System

### Visual Design
- **Compact view** (card footer): Circular arc progress + percentage + "Match" label.
- **Expanded view** (job detail panel): Full section with score, progress bar, and expandable reasoning list.

### Color Coding

| Range | Color | Ring/Bar | Label | Tone |
|-------|-------|----------|-------|------|
| **80–100%** | `match-high` (#16A34A) | Green fill | "Strong Match" | Encouraging |
| **60–79%** | `match-mid` (#D97706) | Amber fill | "Good Match" | Neutral-positive |
| **< 60%** | `match-low` (#9CA3AF) | Gray fill | "Partial Match" | Neutral, no discouragement |

### Expanded Match Score (Job Detail)
```
┌─────────────────────────────────────────────┐
│  ● 87% Strong Match                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░         │
│                                             │
│  ▸ Why you match                  [expand]  │
│    ✓ Python + ML experience aligns          │
│    ✓ Location match: San Francisco          │
│    ✓ Visa sponsorship confirmed             │
└─────────────────────────────────────────────┘
```
- Collapsed by default on mobile, expanded on desktop.
- Expand/collapse with smooth height animation.
- Each reason has a green checkmark and plain-language explanation.

---

## 6. Component Specifications

### Job Card (List View)

```
┌─────────────────────────────────────────────┐
│  [Logo]  Senior ML Engineer         [H-1B ✓]│
│          Anthropic                   [Save] │
│                                             │
│  📍 San Francisco, CA    💰 $180k–$250k     │
│                                             │
│  ─────────────────────────────────────────  │
│  2d ago                    ○ 92% Match      │
└─────────────────────────────────────────────┘
```

**Specs:**
- `border-radius`: 12px (`rounded-xl`)
- `padding`: 16px (p-4)
- `border`: 1px `border-default`, on hover: transitions to `border-slate-300`
- `background`: `bg-card` / `bg-card-dark`
- **Selected state**: `bg-selected` + `border-primary-200` + left 3px border `primary-600`
- **Hover**: `translateY(-1px)`, `shadow-md`, border color transition
- **Sponsor badge**: Always top-right, most prominent element
- **Match score**: Bottom-right, compact circular variant
- **Transition**: 200ms ease-out for all hover effects

### Job Detail Panel

**Specs:**
- Sticky header (title + actions) while scrolling content
- Badge row: Sponsor badge + Green Card badge (if applicable)
- Info row: Location, salary (mono font), posted date — icon + text pairs
- Match panel: Expandable section with score + reasons
- Description: `body` type, `leading-relaxed`, preserves line breaks
- Requirements: Unordered list with custom bullet (small indigo dot)

### Sidebar Navigation

**Specs:**
- Width: 256px (unchanged)
- Background: `bg-sidebar` with right border
- Logo: "VisaHire" — Plus Jakarta Sans 700, `primary-600` color
- Nav items: DM Sans 500, 14px
  - Default: `text-secondary`, no background
  - Hover: `bg-hover`, `text-primary`
  - Active: `bg-selected` (indigo-50), `text-primary-600`, **left 3px border accent** `primary-600`
- Section divider between main nav and footer (Settings)
- Icons: 20px Lucide icons, same color as text

### Metric Cards (Dashboard)

**Specs:**
- Height: auto, consistent padding (20px)
- Value: `metric` type (32px Jakarta 800)
- Title: `caption` type, uppercase, `text-tertiary`, 0.05em letter-spacing
- Trend indicator: Small pill, green/red, `caption` type
- Icon: 40px container, `primary-50` background, `primary-600` icon color
- Hover: `shadow-md`, subtle lift

### Data Table (Sponsorship Stats)

**Specs:**
- Header: `caption` type, uppercase, `text-tertiary`, sticky
- Numbers: `mono` type (JetBrains Mono), right-aligned
- Row hover: `bg-hover`
- Alternating rows: None (hover is sufficient)
- Sort indicators: Small chevron icons
- Approval rate: Color-coded text (green >90%, amber 70–90%, gray <70%)

---

## 7. Layout Architecture

### Shell (unchanged structure, refined spacing)

```
┌──────────┬──────────────────────────────────┐
│          │  TopBar (64px, sticky)            │
│  Sidebar │──────────────────────────────────│
│  (256px) │                                   │
│          │  Main Content                     │
│          │  padding: 24px                    │
│          │  max-width: 1280px (on dashboard) │
│          │                                   │
│          │                                   │
└──────────┴──────────────────────────────────┘
```

### Responsive Breakpoints

| Breakpoint | Sidebar | Layout | Notes |
|-----------|---------|--------|-------|
| `< 768px` (mobile) | Hidden, hamburger menu overlay | Single column | Job detail replaces list on select |
| `768–1024px` (tablet) | Visible, 240px | Adjusted grids (2-col) | Job search: stacked or narrow split |
| `> 1024px` (desktop) | Visible, 256px | Full layout | Job search: list (1/3) + detail (2/3) |

### Mobile Navigation
- Bottom tab bar (5 items): Dashboard, Jobs, Stats, Resume, More
- "More" opens sheet with: Saved Jobs, Alumni, Settings
- Current page indicated by filled icon + primary color

---

## 8. Motion & Animation

### Principles
1. **Purposeful only.** Every animation communicates state change — nothing decorative.
2. **Fast.** Most transitions < 200ms. Page transitions 300ms max.
3. **Respect user preferences.** All motion wrapped in `prefers-reduced-motion` check.

### Timing Functions
- **Enter**: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out, snappy)
- **Exit**: `cubic-bezier(0.4, 0, 1, 1)` (ease-in, quick)
- **Hover**: `ease-out` 150ms

### Specific Animations

| Element | Trigger | Animation | Duration |
|---------|---------|-----------|----------|
| **Page content** | Route change | Fade in + translate Y 8px → 0 | 250ms |
| **Job card hover** | Mouse enter | translateY(-1px), shadow-md, border color | 150ms |
| **Job card selected** | Click | Left border slides in from 0 → 3px | 200ms |
| **Job detail panel** | Job selected | Fade in + translate X 12px → 0 | 200ms |
| **Save bookmark** | Click | Scale 1 → 1.2 → 1, color fill | 300ms (spring) |
| **Match score ring** | Mount / score change | strokeDasharray animate from 0 → score | 800ms ease-out |
| **Match reasons** | Expand toggle | Height auto-animate, fade children in staggered 50ms | 300ms |
| **Badge appear** | Card mount | Scale 0.9 → 1, opacity 0 → 1 | 200ms, 100ms delay |
| **Toast** | Show/hide | Slide in from top-right, slide out | 300ms / 200ms |
| **Metric card value** | Mount | Count up from 0 to value | 600ms ease-out |

### Reduced Motion Override
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Iconography

- **Library**: Lucide React (already in use — keep)
- **Size scale**: 16px (inline), 20px (nav/buttons), 24px (section headers), 40px (empty states)
- **Stroke width**: 1.75 (slightly lighter than default 2 for refinement)
- **Style**: Outlined only, never filled (except bookmark-saved state)
- **Color**: Inherits text color. Icons in buttons match button text color.

---

## 10. Spacing System

Use Tailwind's 4px base scale consistently:

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Inline icon gaps |
| `space-2` | 8px | Badge padding, tight gaps |
| `space-3` | 12px | Card internal gaps |
| `space-4` | 16px | Card padding, list item gaps |
| `space-5` | 20px | Metric card padding |
| `space-6` | 24px | Page padding, section gaps |
| `space-8` | 32px | Between major sections |
| `space-10` | 40px | Page top margin |

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `rounded-md` | 6px | Badges, small pills |
| `rounded-lg` | 8px | Buttons, inputs |
| `rounded-xl` | 12px | Cards, panels |
| `rounded-2xl` | 16px | Modal overlays, upload zones |
| `rounded-full` | 9999px | Avatars, circular indicators |

---

## 11. Dark Mode

### Strategy
- Class-based toggle (`.dark` on `<html>`) — unchanged
- System preference detection on first load, manual override persisted
- All colors defined as light/dark pairs
- Images/logos: No inversion. Company logos render on neutral card backgrounds.
- Charts (Recharts): Swap axis/grid colors, keep data colors constant.

### Key Surface Mappings

| Light | Dark | Usage |
|-------|------|-------|
| `#F8FAFC` | `#0F172A` | Page background |
| `#FFFFFF` | `#1E293B` | Cards, panels |
| `#F1F5F9` | `#334155` | Hover states |
| `#E2E8F0` | `#334155` | Borders |
| `#EEF2FF` | `rgba(79,70,229,0.15)` | Selected/active states |

---

## 12. Accessibility

- All interactive elements: visible focus ring (`ring-2 ring-primary-600 ring-offset-2`)
- Color is never the sole indicator — badges always have text labels + icons
- Minimum touch target: 44x44px on mobile
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<table>` with proper headers
- `aria-current="page"` on active nav links
- `aria-label` on icon-only buttons
- Screen reader text for match score: "87 percent match, strong match"
- `prefers-reduced-motion`: All animations degrade gracefully
- `prefers-contrast`: High-contrast mode increases border widths and text weights

---

## 13. Emotional Design Notes

### Language
- "Strong Match" not "High Score" — we're connecting people, not grading them
- "May Sponsor" not "Unverified" — softer, hopeful
- "Sponsorship Unknown" not "No Data" — honest without being discouraging
- "Explore roles" not "Search jobs" — less transactional
- "Your matches" not "Results" — personal, curated

### Empty States
- Friendly illustration + supportive copy
- Always provide a clear next action
- Example: "No saved roles yet. Bookmark roles you're interested in and they'll appear here."

### Loading States
- Skeleton screens that match content layout (never spinner-only for content areas)
- Spinner reserved for single-action feedback (save, upload)
- Progressive loading: show what's available immediately, load details async

---

## 14. File Checklist (Implementation Order)

1. `index.html` — Add Google Fonts links (Jakarta, DM Sans, JetBrains Mono)
2. `src/index.css` — Update @theme tokens, add font-family definitions, add reduced-motion media query
3. `src/components/common/Badge.tsx` — New sponsor/maybe/unknown variants with hierarchy
4. `src/components/common/MatchScore.tsx` — Add expandable state, update colors, add labels
5. `src/components/common/JobCard.tsx` — New layout with sponsor badge prominence, selected state, left accent border
6. `src/components/common/Sidebar.tsx` — Updated nav styling with left accent, new typography
7. `src/components/common/TopBar.tsx` — Refined with new fonts
8. `src/components/common/MetricCard.tsx` — Mono numbers, updated icon container
9. `src/pages/Dashboard/Dashboard.tsx` — Updated grid, metric count-up animation
10. `src/pages/JobSearch/JobSearch.tsx` — Refined split view
11. `src/pages/JobSearch/JobDetail.tsx` — Expandable match panel, sticky header
12. `src/pages/JobSearch/JobList.tsx` — Selected state styling
13. `src/pages/SponsorshipStats/SponsorshipStats.tsx` — Mono numbers, color-coded rates
14. `src/pages/ResumeMatch/ResumeUpload.tsx` — Refined upload zone
15. `src/pages/ResumeMatch/ResumeResults.tsx` — Updated cards
16. `src/pages/Alumni/Alumni.tsx` — Updated cards
17. `src/pages/SavedJobs/SavedJobs.tsx` — Updated grid
18. `src/pages/Settings/Settings.tsx` — Updated form styling

---

*This spec is the source of truth. No code changes until we agree on the direction.*
