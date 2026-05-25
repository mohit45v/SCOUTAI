# ScoutAI — Design System & UI Specification
**Version:** 1.0.0

---

## 1. Design Philosophy

**Direction:** Cricket Ground at Night — Dark, high-contrast, stadium-lit.  
Think floodlit Wankhede. Deep navy pitch, sharp lime-green highlights, amber accents for ratings and warnings. Not a sports app that "uses green" — this *breathes* cricket.

**Core Principles:**
- **Signal over noise** — Every element earns its place
- **Data confidence** — Ratings look authoritative, not playful
- **Speed feel** — Transitions under 200ms, loading states always present
- **Mobile-first** — Coaches are on phones at the ground

---

## 2. Color Palette

```css
:root {
  /* Backgrounds */
  --bg-primary: #080f1a;        /* Deep pitch black */
  --bg-surface: #0d1b2a;        /* Card surface */
  --bg-elevated: #112236;       /* Modal / elevated card */
  --bg-hover: #1a2f45;          /* Hover state */

  /* Brand */
  --brand-green: #39ff14;       /* Neon lime — primary CTA, ratings high */
  --brand-green-dim: #1a7a00;   /* Dimmed green for backgrounds */
  --brand-amber: #f59e0b;       /* Amber — warnings, medium ratings */
  --brand-red: #ef4444;         /* Red — low ratings, injury flag */

  /* Text */
  --text-primary: #f0f6ff;      /* Near white */
  --text-secondary: #7a9ab5;    /* Muted blue-grey */
  --text-disabled: #3a5068;

  /* Borders */
  --border-subtle: #1e3448;
  --border-active: #39ff14;

  /* Role chips */
  --chip-bat: #1e3a5f;          /* Blue — Batsman */
  --chip-bowl: #3a1a00;         /* Orange-dark — Bowler */
  --chip-all: #1a3a1a;          /* Green-dark — All-rounder */
  --chip-wk: #2d1a3a;           /* Purple-dark — Wicket Keeper */
}
```

---

## 3. Typography

```css
/* Display — scoreboard feel */
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=JetBrains+Mono:wght@400;500&display=swap');

--font-display: 'Rajdhani', sans-serif;   /* Headers, player names, scores */
--font-body: 'DM Sans', sans-serif;       /* Body copy, labels */
--font-mono: 'JetBrains Mono', monospace; /* Ratings, timestamps, codes */

/* Scale */
--text-xs: 0.75rem;    /* 12px — chips, meta */
--text-sm: 0.875rem;   /* 14px — secondary */
--text-base: 1rem;     /* 16px — body */
--text-lg: 1.125rem;   /* 18px — card titles */
--text-xl: 1.25rem;    /* 20px — section headers */
--text-2xl: 1.5rem;    /* 24px — page headers */
--text-3xl: 2rem;      /* 32px — display */
--text-4xl: 2.5rem;    /* 40px — hero numbers */
```

---

## 4. Component Specifications

### 4.1 Player Card
```
┌─────────────────────────────────┐
│  [Avatar initials]   [Role Chip]│
│  Player Name          ★ 8.5    │
│  Academy · City                 │
│  ──────────────────────────────│
│  Technical: ████████░░  7/10   │
│  Potential: █████████░  9/10   │
│  ──────────────────────────────│
│  [View Report]    [♥ Watchlist] │
└─────────────────────────────────┘
```
- Border: 1px `--border-subtle`, on hover `--border-active` with green glow
- Avatar: Generated from initials, color seeded from name hash
- Rating bar: CSS gradient, animated on mount (width transition 600ms)
- Hover: `translateY(-2px)` + box-shadow green glow

### 4.2 Upload Zone
```
┌─────────────────────────────────┐
│                                 │
│    🎥  Drop video or image      │
│        Click to browse          │
│                                 │
│    JPEG · PNG · WEBP · MP4     │
│         Max 10MB                │
└─────────────────────────────────┘
```
- Dashed border, `--border-subtle`
- On drag-over: `--border-active` + green tint background
- Success state: Green checkmark + filename
- Error state: Red border + message

### 4.3 Analysis Loading State
```
  Analyzing technique...
  ████████████░░░░░░░░  60%
  
  ✓ Image received
  ✓ Stance detected  
  ⟳ Generating report...
```
- Animated cricket ball spinner (CSS only)
- Step-by-step progress text (fake but feels real)
- Gemini streaming → update report fields as they arrive

### 4.4 Scouting Report View
```
┌─────────────────────────────────────┐
│  SCOUTING REPORT          [Export] │
│  Player Name · Role · Date          │
│─────────────────────────────────────│
│  OVERALL    TECHNICAL   POTENTIAL   │
│    8.5         7.0        9.0       │
│─────────────────────────────────────│
│  STRENGTHS                          │
│  ✓ Compact stance                   │
│  ✓ Strong off-side play             │
│                                     │
│  AREAS TO IMPROVE                   │
│  ⚠ High backlift against pace       │
│                                     │
│  DRILLS RECOMMENDED                 │
│  → Throwdown drills on off-stump    │
│                                     │
│  SCOUT NOTE                         │
│  "Technically sound for age..."     │
│                                     │
│  [⭐ Add to Watchlist]  [📁 Drive]  │
└─────────────────────────────────────┘
```

### 4.5 Navigation
- Sticky top nav: ScoutAI logo (left) + Dashboard | Watchlist | New Scout (right)
- Mobile: Bottom tab bar with icons
- Active state: `--brand-green` underline

---

## 5. Spacing System

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

---

## 6. Animation Tokens

```css
--duration-fast: 100ms;
--duration-base: 200ms;
--duration-slow: 400ms;
--duration-reveal: 600ms;

--ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

Key animations:
- **Card mount:** `fadeInUp` 400ms staggered by index (delay: index × 60ms)
- **Rating bars:** Width from 0 → value on report open, 600ms `ease-out`
- **Upload drag:** Scale 1.02 + border color transition 100ms
- **Report reveal:** Sections fade in sequentially with 80ms delays

---

## 7. Accessibility Requirements

| Rule | Implementation |
|------|---------------|
| Color contrast | Min 4.5:1 for text, tested with axe |
| Focus visible | Custom focus ring: `outline: 2px solid var(--brand-green)` |
| ARIA labels | All icon buttons have `aria-label` |
| Screen reader | Upload zone has live region for status |
| Keyboard nav | Full tab order, Escape closes modals |
| Skip link | "Skip to main content" as first element |
| Reduced motion | `@media (prefers-reduced-motion)` disables animations |

---

## 8. Responsive Breakpoints

```css
/* Mobile first */
sm: 640px    /* Phablets */
md: 768px    /* Tablets */
lg: 1024px   /* Laptops */
xl: 1280px   /* Desktops */
```

Card grid:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

---

## 9. Icon System
Use **Lucide React** exclusively (`lucide-react` package).  
Key icons used:
- `Upload`, `Camera`, `Video` — Upload zone
- `Star`, `StarOff` — Watchlist
- `FileText`, `Download` — Report / Export
- `User`, `Users` — Player profiles  
- `AlertTriangle` — Injury flag
- `CheckCircle`, `XCircle` — Strengths/weaknesses
- `Dumbbell` — Drills
- `Trophy` — Overall rating

---

## 10. File & Asset Naming

```
/src
  /assets
    logo.svg          ← ScoutAI cricket-wicket logo (SVG inline)
  /components
    /ui               ← Reusable: Button, Badge, Card, Modal, Spinner
    /features
      /scout          ← UploadZone, AnalysisLoader, ReportView
      /dashboard      ← PlayerCard, PlayerGrid, FilterBar
      /watchlist      ← WatchlistView
  /hooks              ← useGemini, useFirestore, useDriveExport
  /lib                ← gemini.ts, firestore.ts, drive.ts, validators.ts
  /types              ← index.ts (all TypeScript interfaces)
  /utils              ← reportParser.ts, imageProcessor.ts, formatters.ts
  /test               ← *.test.ts files mirroring /lib and /utils
```
