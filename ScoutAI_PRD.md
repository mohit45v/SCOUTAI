# ScoutAI — Product Requirements Document
**Version:** 1.0.0  
**Event:** Agentic Premier League — GDG Cloud Mumbai  
**Date:** 24 May 2026  

---

## 1. Executive Summary

ScoutAI is an AI-powered grassroots cricket talent discovery platform. Coaches upload images or short video clips of players batting/bowling. Gemini Vision analyzes technique and form — generating a structured scouting report persisted in Firestore and exportable to Google Drive.

**Core Problem:** Millions of talented cricketers in India never get discovered. Local coaches lack structured tools to evaluate and document player potential beyond WhatsApp notes.

**Solution:** A multimodal AI agent that turns a phone-shot photo into a professional scouting report in under 60 seconds.

---

## 2. Goals & Success Metrics

| Goal | Metric |
|------|--------|
| Fast analysis | Report generated < 60 seconds |
| Structured output | JSON schema validated, 10+ fields |
| Data persistence | Firestore write success > 99% |
| Drive export | PDF shareable link generated end-to-end |
| Accessibility | WCAG 2.1 AA compliant |
| Code quality | ESLint 0 errors, Vitest coverage > 70% |

---

## 3. User Personas

### Primary — Cricket Coach / Academy Manager
- Manages 20–50 players at a local academy
- Needs structured, comparable reports to track progress over time
- Currently uses WhatsApp voice notes and paper forms

### Secondary — District Scout
- Attends multiple matches per week
- Needs quick capture and cloud-stored shareable reports
- Shares with selectors remotely

---

## 4. Feature Specification

### F1 — Player Profile Creation
- Fields: Name, Age (10–35), Role (Batsman / Bowler / All-rounder / WK), Academy, City
- Validation: All required, age numeric range enforced
- Storage: Firestore `players/{playerId}` document

### F2 — Media Upload & AI Analysis
- Accepted formats: JPEG, PNG, WEBP (images); MP4 (first frame extracted via Canvas API)
- Max size: 10MB enforced client-side before upload
- File validation: MIME type + magic byte check
- Model: `gemini-2.0-flash` with inline base64 image part
- Structured prompt forces JSON-only response

### F3 — Scouting Report Schema
```json
{
  "playerId": "string",
  "analysisTimestamp": "ISO8601",
  "role": "Batsman | Bowler | All-rounder | WK",
  "overallRating": 8,
  "technicalScore": 7,
  "potentialScore": 9,
  "strengths": ["Compact stance", "Strong off-side play"],
  "weaknesses": ["High backlift against pace", "Vulnerable outside off-stump"],
  "drillRecommendations": ["Throwdown drills on off-stump line", "Trigger movement practice"],
  "scoutNote": "Technically sound for age. Watch closely this season.",
  "watchlistRecommended": true,
  "injuryRiskFlag": false
}
```

### F4 — Player Dashboard
- Grid of player cards with avatar, rating badge, role chip
- Filter: by role, min rating, watchlist only
- Search: by name (client-side, debounced)
- Real-time Firestore listener (onSnapshot)

### F5 — Report Export to Google Drive
- Cloud Function generates HTML → PDF-formatted report
- Uploads to Drive folder `ScoutAI Reports/` (auto-created if absent)
- Returns shareable view link
- Drive API v3 via service account (no OAuth friction)

### F6 — Watchlist
- Toggle per player, persisted in Firestore
- Dedicated watchlist tab with sorting by potential score

---

## 5. Out of Scope
- Multi-user authentication
- Full video frame-by-frame analysis
- Native mobile app
- Paid tiers / subscriptions

---

## 6. Technical Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite 5 + TypeScript |
| Styling | Tailwind CSS v3 |
| AI | Gemini 2.0 Flash (Vision) via `@google/generative-ai` SDK |
| Database | Cloud Firestore (Firebase v10 modular SDK) |
| File Storage | Firebase Storage (media uploads) |
| Drive Export | Google Drive API v3 via Cloud Function |
| Functions | Firebase Cloud Functions v2 (Node 20) |
| Hosting | Cloud Run (containerized) |
| IaC | Terraform (GCP) |
| Testing | Vitest + React Testing Library |
| Linting | ESLint 9 + Prettier |

---

## 7. Evaluation Criteria Mapping

| Criterion | Implementation Strategy |
|-----------|------------------------|
| **Code Quality** | TypeScript strict mode, modular custom hooks, barrel exports, JSDoc on all utils |
| **Security** | Client-side file validation, Firestore Security Rules, API keys in env vars only, CORS on Cloud Functions |
| **Efficiency** | Gemini streaming response, Firestore pagination (limit 20), React.memo on cards, image compression before upload |
| **Testing** | Vitest unit tests: report JSON parser, file validator, Firestore CRUD utils, mock Gemini response |
| **Accessibility** | ARIA roles/labels on all interactive elements, keyboard nav, skip-to-content, focus trapping in modals, 4.5:1 contrast |
| **Google Services** | Gemini 2.0 Flash Vision + Firestore + Firebase Storage + Drive API v3 + Cloud Run + Cloud Functions |

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Gemini returns non-JSON | Wrap in try/catch, retry with stricter prompt, show graceful error |
| Drive API needs OAuth | Use service account in Cloud Function, no user OAuth required |
| Video frame extraction fails | Fallback to direct image upload with clear UI message |
| Firestore rules block writes | Permissive rules for hackathon with TODO comment for prod hardening |
| Image too large for Gemini | Client-side canvas resize to max 1024px before base64 encoding |
