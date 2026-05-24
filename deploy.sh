#!/bin/bash
set -e

PROJECT_ID="amd-slingshot-493309"
REGION="asia-south1"

echo "🏏 ScoutAI — Deploying to GCP ($PROJECT_ID)..."

# 1. Build frontend
echo "📦 Building frontend..."
npm run build

# 2. Deploy Firestore rules + indexes
echo "🔒 Deploying Firestore config..."
npx firebase-tools deploy --only firestore:rules --project=$PROJECT_ID

# 3. Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy scoutai \
  --source . \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --project $PROJECT_ID \
  --quiet

SERVICE_URL=$(gcloud run services describe scoutai --region=$REGION --project=$PROJECT_ID --format='value(status.url)')
echo ""
echo "✅ ScoutAI deployed successfully!"
echo "🌐 URL: $SERVICE_URL"
echo ""
