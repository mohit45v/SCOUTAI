# TASKS.md — ScoutAI Build Checklist
> Hackathon build order. Tick off as you go.

---

## ⏱ Phase 1 — Setup (0:00 – 0:20)

- [ ] `npm create vite@latest scoutai -- --template react-ts`
- [ ] `cd scoutai && npm install`
- [ ] Install deps:
  ```bash
  npm i @google/generative-ai firebase lucide-react react-router-dom
  npm i -D tailwindcss postcss autoprefixer vitest @vitest/coverage-v8 @testing-library/react jsdom eslint-config-prettier
  npx tailwindcss init -p
  ```
- [ ] Configure `tailwind.config.ts` (content paths, fontFamily extend)
- [ ] Configure `tsconfig.json` (`"strict": true`, `"baseUrl": "src"`)
- [ ] Configure `vite.config.ts` (test: vitest, resolve aliases)
- [ ] Create `src/index.css` with all CSS variables from DESIGN.md
- [ ] Add Google Fonts import to `index.html` (Rajdhani + DM Sans + JetBrains Mono)
- [ ] Create `.env.local` with all VITE_ variables
- [ ] Create `.env.example` (empty values)
- [ ] Add `.gitignore`

---

## ⏱ Phase 2 — Types & Core Libs (0:20 – 0:40)

- [ ] `src/types/index.ts` — Player, ScoutingReport, UploadState interfaces
- [ ] `src/lib/firebase.ts` — initializeApp, getFirestore, getStorage
- [ ] `src/lib/validators.ts` — validateFile (MIME + size check)
- [ ] `src/utils/imageProcessor.ts` — resizeImage(), extractVideoFrame()
- [ ] `src/utils/reportParser.ts` — parseGeminiReport(), with fallback
- [ ] `src/utils/formatters.ts` — formatDate(), formatRating(), getRatingColor()
- [ ] `src/lib/gemini.ts` — analyzePlayerMedia() with structured prompt
- [ ] `src/lib/firestore.ts` — addPlayer(), getPlayers(), updateWatchlist()
- [ ] `src/lib/drive.ts` — exportToDrive() (calls Cloud Function)

---

## ⏱ Phase 3 — Hooks (0:40 – 0:55)

- [ ] `src/hooks/useGemini.ts` — analyze state, loading, error
- [ ] `src/hooks/useFirestore.ts` — players list with onSnapshot
- [ ] `src/hooks/useDriveExport.ts` — export state, loading, link

---

## ⏱ Phase 4 — UI Components (0:55 – 1:20)

### Base UI
- [ ] `src/components/ui/SkipLink.tsx`
- [ ] `src/components/ui/Spinner.tsx` — Cricket ball spin animation
- [ ] `src/components/ui/Button.tsx` — variants: primary, secondary, ghost
- [ ] `src/components/ui/Badge.tsx` — Role chips, rating badge
- [ ] `src/components/ui/Card.tsx` — Base card with hover glow
- [ ] `src/components/ui/Modal.tsx` — Accessible modal with focus trap

### Layout
- [ ] `src/components/layout/Navbar.tsx`
- [ ] `src/components/layout/Layout.tsx`

### Features
- [ ] `PlayerForm.tsx`, `UploadZone.tsx`, `AnalysisLoader.tsx`, `ReportView.tsx`
- [ ] `PlayerCard.tsx`, `FilterBar.tsx`, `PlayerGrid.tsx`
- [ ] `WatchlistView.tsx`

---

## ⏱ Phase 5 — Pages & Routing (1:20 – 1:40)

- [ ] `DashboardPage.tsx`, `ScoutPage.tsx`, `WatchlistPage.tsx`
- [ ] `App.tsx` — React Router v6
- [ ] `main.tsx`

---

## ⏱ Phase 6 — Cloud Function (1:40 – 2:00)

- [ ] `functions/src/driveExport.ts` (full code in DEPLOYMENT.md)
- [ ] Test with emulator
- [ ] `firebase deploy --only functions`
- [ ] Update function URL in `.env.local`

---

## ⏱ Phase 7 — Tests (2:00 – 2:20)

- [ ] `validators.test.ts` — valid types, reject PDF, reject oversized
- [ ] `reportParser.test.ts` — valid JSON, malformed JSON, missing fields
- [ ] `firestore.test.ts` — mock Firestore, CRUD, watchlist toggle
- [ ] `imageProcessor.test.ts` — resize dimensions, base64 output
- [ ] `npm run test:coverage` → > 70%

---

## ⏱ Phase 8 — Deploy (2:20 – 2:35)

- [ ] `firebase deploy --only firestore,storage`
- [ ] `npm run build` — zero TS errors
- [ ] `npm run lint` — zero ESLint errors
- [ ] `Dockerfile` + `nginx.conf` created
- [ ] `./deploy.sh` → Cloud Run live
- [ ] Test full E2E: Player → Upload → Report → Drive export

---

## ⏱ Phase 9 — Polish (2:35 – 2:45)

- [ ] ARIA labels on all icon buttons
- [ ] Keyboard nav test
- [ ] Mobile layout check (375px)
- [ ] README.md with live URL

---

## Google Services Checklist (for judging)

- [ ] ✅ Gemini 2.0 Flash Vision
- [ ] ✅ Cloud Firestore
- [ ] ✅ Firebase Storage
- [ ] ✅ Cloud Functions v2
- [ ] ✅ Google Drive API v3
- [ ] ✅ Cloud Run (asia-south1)
