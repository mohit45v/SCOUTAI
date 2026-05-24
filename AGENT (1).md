# AGENT.md — ScoutAI
> Instruction file for AI coding agents (Claude Code, Cursor, Copilot, etc.)

---

## Project Overview

ScoutAI is an AI-powered cricket talent scouting app built for the Agentic Premier League hackathon.  
**Stack:** React 18 + Vite 5 + TypeScript + Tailwind CSS + Firebase + Gemini 2.0 Flash  
**Deployment:** GCP Cloud Run (asia-south1)

---

## File Structure

```
scoutai/
├── AGENT.md                    ← You are here
├── PRD.md                      ← Product requirements
├── DESIGN.md                   ← Design system
├── DEPLOYMENT.md               ← GCP deployment guide
├── TASKS.md                    ← Build checklist
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── .env.example
├── .env.local                  ← Never commit
├── Dockerfile
├── nginx.conf
├── deploy.sh
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css                ← CSS variables + global styles
│   │
│   ├── types/
│   │   └── index.ts             ← All TypeScript interfaces
│   │
│   ├── lib/
│   │   ├── firebase.ts          ← Firebase app init
│   │   ├── firestore.ts         ← Firestore CRUD operations
│   │   ├── gemini.ts            ← Gemini API client + prompt
│   │   ├── drive.ts             ← Drive export via Cloud Function
│   │   └── validators.ts        ← File validation utilities
│   │
│   ├── utils/
│   │   ├── reportParser.ts      ← Parse Gemini JSON response
│   │   ├── imageProcessor.ts    ← Resize image before Gemini
│   │   └── formatters.ts        ← Date, rating formatters
│   │
│   ├── hooks/
│   │   ├── useGemini.ts         ← Gemini analysis hook
│   │   ├── useFirestore.ts      ← Players CRUD hook
│   │   └── useDriveExport.ts    ← Drive export hook
│   │
│   ├── components/
│   │   ├── ui/                  ← Base components
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── SkipLink.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Layout.tsx
│   │   │
│   │   └── features/
│   │       ├── scout/
│   │       │   ├── PlayerForm.tsx       ← New player details
│   │       │   ├── UploadZone.tsx       ← Drag/drop media upload
│   │       │   ├── AnalysisLoader.tsx   ← Loading state
│   │       │   └── ReportView.tsx       ← Full report display
│   │       │
│   │       ├── dashboard/
│   │       │   ├── PlayerCard.tsx       ← Individual player card
│   │       │   ├── PlayerGrid.tsx       ← Grid of cards
│   │       │   └── FilterBar.tsx        ← Role/rating filters
│   │       │
│   │       └── watchlist/
│   │           └── WatchlistView.tsx    ← Watchlisted players
│   │
│   └── pages/
│       ├── DashboardPage.tsx
│       ├── ScoutPage.tsx
│       └── WatchlistPage.tsx
│
├── functions/
│   ├── package.json
│   ├── tsconfig.json
│   ├── sa-key.json              ← Never commit (service account)
│   └── src/
│       ├── index.ts             ← Export all functions
│       └── driveExport.ts       ← Cloud Function for Drive export
│
└── src/test/
    ├── reportParser.test.ts
    ├── validators.test.ts
    ├── firestore.test.ts
    └── imageProcessor.test.ts
```

---

## Key Interfaces (types/index.ts)

```typescript
export interface Player {
  id: string;
  name: string;
  age: number;
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'WK';
  academy: string;
  city: string;
  mediaUrl?: string;
  watchlisted: boolean;
  createdAt: string; // ISO8601
  report?: ScoutingReport;
}

export interface ScoutingReport {
  playerId: string;
  analysisTimestamp: string;
  role: Player['role'];
  overallRating: number;    // 1-10
  technicalScore: number;   // 1-10
  potentialScore: number;   // 1-10
  strengths: string[];
  weaknesses: string[];
  drillRecommendations: string[];
  scoutNote: string;
  watchlistRecommended: boolean;
  injuryRiskFlag: boolean;
}

export interface UploadState {
  status: 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';
  progress: number;
  error?: string;
}
```

---

## Core Implementation Notes

### Gemini Analysis (lib/gemini.ts)
```typescript
// Always use gemini-2.0-flash model
// Send image as inline base64, not URL
// Force JSON-only response with this system prompt:

const SYSTEM_PROMPT = `You are an expert cricket scout with 20+ years experience.
Analyze the provided image of a cricket player and return ONLY a valid JSON object.
No markdown, no explanation, no preamble. Just the JSON.

JSON schema:
{
  "overallRating": number between 1-10,
  "technicalScore": number between 1-10,
  "potentialScore": number between 1-10,
  "strengths": array of 2-4 specific technical strengths observed,
  "weaknesses": array of 1-3 areas for improvement,
  "drillRecommendations": array of 2-3 specific actionable drills,
  "scoutNote": "one paragraph professional scout commentary",
  "watchlistRecommended": boolean,
  "injuryRiskFlag": boolean based on visible technique risks
}`;
```

### Image Processing (utils/imageProcessor.ts)
```typescript
// Before sending to Gemini:
// 1. Resize to max 1024px (longest edge) using Canvas API
// 2. Convert to JPEG at 0.85 quality
// 3. Convert to base64 string (strip data URL prefix)
// For video: extract first frame at 1s mark using HTMLVideoElement
```

### Firestore Operations (lib/firestore.ts)
```typescript
// Collections:
// players/{playerId}  — Player document (includes nested report)
// 
// Use serverTimestamp() for createdAt
// Use onSnapshot for real-time dashboard updates
// Paginate with limit(20) + startAfter for large lists
```

### File Validation (lib/validators.ts)
```typescript
// Check BOTH:
// 1. file.type (MIME type from browser)
// 2. First 4 bytes (magic bytes) for JPEG/PNG/WEBP/MP4
// Allowed: image/jpeg, image/png, image/webp, video/mp4
// Max size: 10 * 1024 * 1024 bytes (10MB)
// Return: { valid: boolean, error?: string }
```

---

## Scoring Criteria — What the Agent Must Prioritize

### Code Quality
- TypeScript strict mode (`"strict": true` in tsconfig)
- No `any` types — use proper interfaces
- Custom hooks for all side effects
- Components under 150 lines — extract if larger
- Meaningful variable names, JSDoc on exported functions

### Security
- **NEVER** hardcode API keys — always `import.meta.env.VITE_*`
- File validation before any upload
- Sanitize player name input (trim, max 100 chars)
- Firestore rules deployed (not just default open)
- CORS configured on Cloud Function

### Efficiency
- `React.memo` on `PlayerCard` (re-renders on filter changes)
- `useMemo` for filtered player list
- `useCallback` for event handlers passed to lists
- Debounce search input (300ms)
- Image compressed before Gemini (saves tokens + latency)
- Firestore: only fetch fields needed for card view

### Testing
These test files are REQUIRED:
1. `reportParser.test.ts` — parse valid JSON, handle malformed JSON, handle missing fields
2. `validators.test.ts` — valid image types, reject PDF, reject oversized file
3. `firestore.test.ts` — mock Firestore, test CRUD, test watchlist toggle
4. `imageProcessor.test.ts` — test resize dimensions, test video frame extraction

### Accessibility
Every interactive element needs:
- `aria-label` or visible label
- `role` if not semantic HTML
- Keyboard event handler if custom interactive
- Focus management when modal opens/closes
- UploadZone: `<input type="file">` hidden but accessible

---

## Build Order for Agent

Execute tasks in this order to maximize working demo:

1. `npm create vite@latest scoutai -- --template react-ts`
2. Install deps: `npm i @google/generative-ai firebase lucide-react tailwindcss`
3. Setup: `tailwind.config.ts`, `tsconfig.json`, `index.css` (CSS vars)
4. Build: `types/index.ts` (all interfaces first)
5. Build: `lib/firebase.ts` → `lib/validators.ts` → `lib/gemini.ts`
6. Build: `utils/imageProcessor.ts` → `utils/reportParser.ts`
7. Build: `lib/firestore.ts` → `hooks/useFirestore.ts` → `hooks/useGemini.ts`
8. Build: UI components (`Button`, `Badge`, `Card`, `Modal`, `Spinner`)
9. Build: `UploadZone` → `PlayerForm` → `AnalysisLoader` → `ReportView`
10. Build: `PlayerCard` → `PlayerGrid` → `FilterBar`
11. Build: `DashboardPage` → `ScoutPage` → `WatchlistPage`
12. Build: `Navbar` → `App.tsx` (routing with React Router v6)
13. Build: `functions/src/driveExport.ts`
14. Write tests in `src/test/`
15. Add `Dockerfile` + `nginx.conf`
16. Run `npm run build` — fix all TypeScript errors
17. Deploy: `./deploy.sh`

---

## Commands Reference

```bash
# Development
npm run dev              # Start Vite dev server
firebase emulators:start # Start Firebase emulators

# Quality
npm run lint             # ESLint check
npm run type-check       # TypeScript check (no emit)
npm run test             # Vitest
npm run test:coverage    # Coverage report

# Build & Deploy
npm run build            # Production build
./deploy.sh              # Full GCP deployment

# Scripts in package.json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "preview": "vite preview"
  }
}
```

---

## What NOT to Do

- ❌ Don't use `create-react-app` — use Vite
- ❌ Don't use class components — functional only
- ❌ Don't put Firestore logic directly in components — use hooks
- ❌ Don't commit `.env.local` or `sa-key.json`
- ❌ Don't use `any` type
- ❌ Don't skip loading/error states — every async op needs both
- ❌ Don't hardcode player data — everything from Firestore
- ❌ Don't forget `alt` on images and `aria-label` on icon buttons
- ❌ Don't use `gemini-pro` — use `gemini-2.0-flash` (latest, faster)
