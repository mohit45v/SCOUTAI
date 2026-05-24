# ScoutAI — GCP Deployment Guide
**Stack:** Cloud Run + Firebase + Cloud Functions v2  
**Region:** asia-south1 (Mumbai)

---

## 1. Architecture Overview

```
                    ┌─────────────────────────────┐
                    │         Cloud Run            │
                    │   (React Vite — Nginx)       │
                    │   asia-south1                │
                    └──────────────┬──────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
    ┌─────────▼────────┐  ┌───────▼────────┐  ┌───────▼────────┐
    │  Gemini 2.0 Flash │  │   Firestore    │  │ Cloud Function │
    │  (Vision API)    │  │  (asia-south1) │  │  driveExport   │
    └──────────────────┘  └───────┬────────┘  └───────┬────────┘
                                  │                    │
                          ┌───────▼────────┐  ┌───────▼────────┐
                          │Firebase Storage│  │  Google Drive  │
                          │ (media files)  │  │   API v3       │
                          └────────────────┘  └────────────────┘
```

---

## 2. Prerequisites

```bash
# Install required CLIs
npm install -g firebase-tools
gcloud components install beta

# Verify versions
gcloud --version       # >= 470.0.0
firebase --version     # >= 13.0.0
node --version         # >= 20.0.0
```

---

## 3. GCP Project Setup

```bash
# Set your project ID
export PROJECT_ID="scoutai-apl-2026"
export REGION="asia-south1"

# Create project
gcloud projects create $PROJECT_ID --name="ScoutAI APL"
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  cloudfunctions.googleapis.com \
  cloudbuild.googleapis.com \
  firestore.googleapis.com \
  storage.googleapis.com \
  drive.googleapis.com \
  aiplatform.googleapis.com \
  iam.googleapis.com \
  artifactregistry.googleapis.com

# Set billing account (required for Cloud Run)
# gcloud billing projects link $PROJECT_ID --billing-account=YOUR_BILLING_ID
```

---

## 4. Firebase Setup

```bash
# Login and init Firebase
firebase login
firebase init

# Select:
# ✓ Firestore
# ✓ Storage
# ✓ Functions (Node 20, TypeScript)
# ✓ Hosting (optional, we use Cloud Run)
# ✓ Emulators (Firestore, Storage, Functions)

# Set Firebase project
firebase use --add $PROJECT_ID
```

### 4.1 Firestore Rules (firestore.rules)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // TODO: Tighten for production with auth
    // Hackathon: permissive writes, no auth required
    match /players/{playerId} {
      allow read, write: if true;
    }
    match /reports/{reportId} {
      allow read, write: if true;
    }
  }
}
```

### 4.2 Firestore Indexes (firestore.indexes.json)
```json
{
  "indexes": [
    {
      "collectionGroup": "players",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "watchlisted", "order": "DESCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "players",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "role", "order": "ASCENDING" },
        { "fieldPath": "overallRating", "order": "DESCENDING" }
      ]
    }
  ]
}
```

### 4.3 Storage Rules (storage.rules)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /players/{playerId}/{allPaths=**} {
      allow read: if true;
      // Max 10MB, image/video types only
      allow write: if request.resource.size < 10 * 1024 * 1024
        && request.resource.contentType.matches('image/.*|video/.*');
    }
  }
}
```

---

## 5. Environment Variables

### .env.local (frontend — never commit)
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=scoutai-apl-2026.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=scoutai-apl-2026
VITE_FIREBASE_STORAGE_BUCKET=scoutai-apl-2026.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_DRIVE_EXPORT_FUNCTION_URL=https://asia-south1-scoutai-apl-2026.cloudfunctions.net/driveExport
```

### .env.example (commit this)
```env
VITE_GEMINI_API_KEY=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_DRIVE_EXPORT_FUNCTION_URL=
```

---

## 6. Service Account for Drive API

```bash
# Create service account for Cloud Function → Drive
gcloud iam service-accounts create scoutai-drive-sa \
  --display-name="ScoutAI Drive Export" \
  --project=$PROJECT_ID

# Grant Drive API access (domain-wide delegation not needed — 
# function creates files on behalf of service account)
gcloud iam service-accounts keys create ./functions/sa-key.json \
  --iam-account=scoutai-drive-sa@$PROJECT_ID.iam.gserviceaccount.com

# DO NOT commit sa-key.json — add to .gitignore
```

---

## 7. Cloud Function — Drive Export

### functions/src/driveExport.ts
```typescript
import { onRequest } from "firebase-functions/v2/https";
import { google } from "googleapis";
import * as serviceAccount from "./sa-key.json";

export const driveExport = onRequest(
  { region: "asia-south1", cors: true, memory: "256MiB" },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const { playerName, reportHtml, playerId } = req.body;

    if (!playerName || !reportHtml) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    try {
      const auth = new google.auth.GoogleAuth({
        credentials: serviceAccount,
        scopes: ["https://www.googleapis.com/auth/drive.file"],
      });

      const drive = google.drive({ version: "v3", auth });

      // Find or create ScoutAI Reports folder
      const folderSearch = await drive.files.list({
        q: "name='ScoutAI Reports' and mimeType='application/vnd.google-apps.folder' and trashed=false",
        fields: "files(id)",
      });

      let folderId: string;
      if (folderSearch.data.files && folderSearch.data.files.length > 0) {
        folderId = folderSearch.data.files[0].id!;
      } else {
        const folder = await drive.files.create({
          requestBody: {
            name: "ScoutAI Reports",
            mimeType: "application/vnd.google-apps.folder",
          },
          fields: "id",
        });
        folderId = folder.data.id!;
      }

      // Upload HTML as Google Doc (auto-converts for viewing)
      const { Readable } = await import("stream");
      const stream = Readable.from([reportHtml]);

      const file = await drive.files.create({
        requestBody: {
          name: `ScoutAI_${playerName}_${new Date().toISOString().split("T")[0]}.html`,
          parents: [folderId],
          mimeType: "text/html",
        },
        media: {
          mimeType: "text/html",
          body: stream,
        },
        fields: "id, webViewLink",
      });

      // Make publicly viewable
      await drive.permissions.create({
        fileId: file.data.id!,
        requestBody: { role: "reader", type: "anyone" },
      });

      res.status(200).json({
        success: true,
        fileId: file.data.id,
        viewLink: file.data.webViewLink,
      });
    } catch (error) {
      console.error("Drive export error:", error);
      res.status(500).json({ error: "Export failed" });
    }
  }
);
```

### Deploy Function
```bash
cd functions
npm install googleapis
firebase deploy --only functions:driveExport
```

---

## 8. Dockerfile (Cloud Run)

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf
```nginx
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|svg|ico|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
```

---

## 9. Cloud Run Deployment

```bash
# Option A: Direct source deploy (fastest for hackathon)
gcloud run deploy scoutai \
  --source . \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 3 \
  --set-env-vars "NODE_ENV=production"

# Option B: Build + push to Artifact Registry then deploy
gcloud artifacts repositories create scoutai-repo \
  --repository-format=docker \
  --location=$REGION

docker build -t $REGION-docker.pkg.dev/$PROJECT_ID/scoutai-repo/scoutai:latest .
docker push $REGION-docker.pkg.dev/$PROJECT_ID/scoutai-repo/scoutai:latest

gcloud run deploy scoutai \
  --image $REGION-docker.pkg.dev/$PROJECT_ID/scoutai-repo/scoutai:latest \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080
```

---

## 10. Quick Deploy Script (deploy.sh)

```bash
#!/bin/bash
set -e

PROJECT_ID="scoutai-apl-2026"
REGION="asia-south1"

echo "🏏 ScoutAI — Deploying to GCP..."

# 1. Build frontend
echo "📦 Building frontend..."
npm run build

# 2. Deploy Cloud Functions
echo "⚡ Deploying Cloud Functions..."
cd functions && npm run build && cd ..
firebase deploy --only functions

# 3. Deploy Firestore rules + indexes
echo "🔒 Deploying Firestore rules..."
firebase deploy --only firestore

# 4. Deploy Storage rules
echo "📁 Deploying Storage rules..."
firebase deploy --only storage

# 5. Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy scoutai \
  --source . \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --quiet

SERVICE_URL=$(gcloud run services describe scoutai --region=$REGION --format='value(status.url)')
echo ""
echo "✅ ScoutAI deployed successfully!"
echo "🌐 URL: $SERVICE_URL"
echo ""
```

```bash
chmod +x deploy.sh && ./deploy.sh
```

---

## 11. Local Development

```bash
# Install dependencies
npm install

# Start Firebase Emulators
firebase emulators:start --only firestore,storage,functions

# Start dev server (separate terminal)
npm run dev

# Emulator UI
open http://localhost:4000
```

---

## 12. .gitignore

```
# Dependencies
node_modules/
functions/node_modules/

# Build
dist/
functions/lib/

# Secrets — CRITICAL
.env.local
.env.*.local
functions/sa-key.json
*-service-account*.json

# Firebase
.firebase/
firebase-debug.log

# OS
.DS_Store
*.swp
```

---

## 13. Estimated GCP Costs (Hackathon Day)

| Service | Usage | Cost |
|---------|-------|------|
| Cloud Run | ~50 requests | Free tier |
| Firestore | ~200 reads/writes | Free tier |
| Firebase Storage | ~100MB | Free tier |
| Cloud Functions | ~20 invocations | Free tier |
| Gemini API | ~30 requests | Free tier |
| **Total** | | **~$0** |

All usage stays well within GCP free tier for a hackathon event.
