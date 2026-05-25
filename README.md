# 🏏 ScoutAI — Grassroots Cricket Talent Discovery Platform

ScoutAI is an AI-powered grassroots cricket scouting platform built for the **GDG Cloud Mumbai - Agentic Premier League Hackathon**. The platform enables coaches, scouts, and academies to upload video footages (MP4) or images (JPEG/PNG) of young cricketers, perform real-time analysis of their batting/bowling techniques using **Google Gemini 2.5 Flash**, maintain a centralized directory of prospects, and export structured scouting evaluations directly to Google Drive.

🌐 **Live Demo URL**: [https://scoutai-fm3dol2zfq-el.a.run.app](https://scoutai-fm3dol2zfq-el.a.run.app)  
🎥 **GCP Region**: `asia-south1` (Mumbai)  

---

## 🚀 Key Features

* **AI Scouting Report Generation**: Leveraging Gemini 2.5 Flash Vision API to analyze batting stance, grip, execution, and potential injury risks directly from media files.
* **Canvas Video Frame Extractor**: High-performance client-side extraction of active frames from MP4 videos, compressing them to max 1024px to minimize bandwidth and Gemini API latency.
* **Grassroots Talent Directory**: Real-time Firestore sync of scouted prospects with filters for age, playing role, minimum rating, and watchlist bookmarking.
* **Advanced Metrics Visualization**: Custom stadium-lit progress meters and interactive dashboard components showing Technical Styles, Growth Potentials, and Overall Ratings.
* **Google Drive Export Integration**: Triggers a secure, dedicated GCP Cloud Function v2 (`driveExport`) using a Service Account to compile scouting reports into styled Google Docs and generate shareable links.

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite 5, TypeScript, Tailwind CSS, Lucide Icons, React Router v6.
* **AI Model**: Google Gemini 2.5 Flash API (utilizing structured JSON schema output).
* **Database & Auth**: Cloud Firestore (Native Mode real-time listeners and transactional CRUD).
* **Backend Functions**: Firebase Cloud Functions v2 (Node.js 20, Googleapis Node Client).
* **Hosting & Containerization**: GCP Cloud Run (asia-south1) served via a secure, optimized Nginx container, configured with HTTP/2 and security headers.
* **Testing**: Vitest + JSDOM unit testing suite verifying core utility functions, validations, and data parsing schemas.

---

## 📂 Codebase Reorganization

The repository has been structured cleanly for easy review:
```yaml
SCOUTAI/
├── docs/                     # PRD, Architecture Design, and Deployment specifications
├── firebase/                 # Firestore Security Rules and Indexes
├── functions/                # Cloud Functions v2 for Google Drive exports
├── public/                   # Static favicon and vector icons
├── src/                      # React SPA source code
│   ├── components/           # Feature UI layouts and shared buttons/modals
│   ├── hooks/                # useFirestore, useGemini, and useDriveExport state hooks
│   ├── lib/                  # Client connectors for Firebase and Gemini API
│   ├── utils/                # Video frame processor and Gemini report parser
│   └── test/                 # 14/14 pass-verified unit tests
├── Dockerfile                # Multi-stage Docker build config
├── nginx.conf                # Secured Nginx proxy router config
└── deploy.sh                 # GCP deployment automated script
```

---

## ⚙️ Installation & Local Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/mohit45v/SCOUTAI.git
cd SCOUTAI
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_DRIVE_EXPORT_FUNCTION_URL=https://asia-south1-your_project_id.cloudfunctions.net/driveExport
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Run Test Suite
To verify code logic, validations, and image resizing utilities:
```bash
npm run test
```

---

## 📞 Developer Contact & Socials

For any questions, system access, or project reviews, feel free to reach out:

* **WhatsApp / Phone**: [+91 89990 20150](https://wa.me/918999020150)
* **LinkedIn**: [mohit45v](https://www.linkedin.com/in/mohit45v/)
* **Instagram**: [@mohit.45v](https://www.instagram.com/mohit.45v)
* **Twitter / X**: [@mohit_45v](https://x.com/mohit_45v)
* **Email**: [mohit.dhangar88@gmail.com](mailto:mohit.dhangar88@gmail.com)
