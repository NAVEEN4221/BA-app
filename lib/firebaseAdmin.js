const admin = require('firebase-admin')
const fs = require('fs')
const path = require('path')

function initAdmin() {
  if (admin.apps && admin.apps.length) return admin

  // Try service account JSON from env or local file
  const svcPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, '..', 'serviceAccountKey.json')
  if (svcPath && fs.existsSync(svcPath)) {
    try {
      // Use fs read + JSON.parse to avoid dynamic require which Turbopack disallows
      const raw = fs.readFileSync(svcPath, 'utf8')
      const serviceAccount = JSON.parse(raw)
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      })
      return admin
    } catch (e) {
      // fallthrough to other methods
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  let privateKey = process.env.FIREBASE_PRIVATE_KEY

  if (privateKey) {
    // private key may be stored with escaped newlines
    privateKey = privateKey.replace(/\\n/g, '\n')
  }

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })
  } else {
    // Fallback to application-default credentials if available
    try {
      admin.initializeApp()
    } catch (e) {
      // If initialization fails later, let callers handle it
      // but we avoid crashing during import.
    }
  }

  return admin
}

module.exports = initAdmin()
