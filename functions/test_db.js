const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const saKey = require('./sa-key.json');

initializeApp({
  credential: cert(saKey),
  projectId: 'amd-slingshot-493309'
});

const db = getFirestore('scoutai');

async function test() {
  console.log('🏏 Writing test document...');
  const ref = db.collection('players').doc('test-player-id-123');
  await ref.set({
    name: "Mohit Test Player",
    age: 22,
    city: "Mumbai",
    academy: "APL Academy",
    role: "All-rounder",
    watchlisted: false,
    createdAt: new Date().toISOString(),
    report: {
      overallRating: 8.5,
      technicalScore: 8.2,
      potentialScore: 9.0,
      strengths: ["Excellent seam position", "Strong bat swing"],
      weaknesses: ["Vulnerable to short ball"],
      drillRecommendations: ["Practice short ball defense"],
      scoutNote: "Looks very promising.",
      analysisTimestamp: new Date().toISOString()
    }
  });
  console.log('✅ Successfully wrote document!');

  console.log('📖 Reading documents from players collection:');
  const snapshot = await db.collection('players').get();
  snapshot.forEach(doc => {
    console.log(`- ${doc.id} => ${doc.data().name}`);
  });
}

test().catch(err => {
  console.error('❌ Error:', err);
});
