const admin = require('./firebaseAdmin')

const API_KEY = process.env.FIREBASE_API_KEY
const SIGNIN_URL = (apiKey) => `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`
const SIGNUP_URL = (apiKey) => `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`

async function signInWithPassword(email, password) {
  if (!API_KEY) throw new Error('FIREBASE_API_KEY is not configured')

  const res = await fetch(SIGNIN_URL(API_KEY), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  })

  const data = await res.json()
  if (!res.ok) {
    const message = data && data.error && data.error.message ? data.error.message : 'Invalid credentials'
    throw new Error(message)
  }

  return data
}

async function signUpWithEmail(email, password) {
  if (!API_KEY) throw new Error('FIREBASE_API_KEY is not configured')
  const res = await fetch(SIGNUP_URL(API_KEY), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  })
  const data = await res.json()
  if (!res.ok) {
    const message = data && data.error && data.error.message ? data.error.message : 'Signup failed'
    throw new Error(message)
  }
  return data
}

async function login({ email, password }) {
  if (!email || !password) throw new Error('Missing email or password')
  const data = await signInWithPassword(email, password)
  return {
    uid: data.localId,
    idToken: data.idToken,
    refreshToken: data.refreshToken,
    expiresIn: data.expiresIn,
    email: data.email,
  }
}

async function signup({ name, email, password }) {
  if (!email || !password) throw new Error('Missing email or password')

  // Prefer Admin SDK if initialized; otherwise fall back to REST signup
  const hasAdmin = admin && admin.apps && admin.apps.length > 0 && admin.auth
  if (hasAdmin) {
    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: name || undefined,
      })
      // Use REST to obtain tokens
      const tokens = await signInWithPassword(email, password)
      const result = {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName || name || null,
        idToken: tokens.idToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      }

      // Persist profile to Firestore
      try {
        const profile = { email: result.email, displayName: result.displayName, createdAt: Date.now() }
        await admin.firestore().collection('users').doc(result.uid).set(profile)
        result.dbWrite = { provider: 'firestore', ok: true }
      } catch (e) {
        result.dbWrite = { provider: 'firestore', ok: false, message: e.message }
      }

      return result
    } catch (err) {
      if (err.code === 'auth/email-already-exists') throw new Error('Email already in use')
      throw err
    }
  }

  // Fallback: use REST signup (requires API_KEY only)
  const data = await signUpWithEmail(email, password)
  // data contains localId, idToken, refreshToken
  const result = {
    uid: data.localId,
    email: data.email,
    displayName: name || null,
    idToken: data.idToken,
    refreshToken: data.refreshToken,
    expiresIn: data.expiresIn,
  }

  // Try to persist basic profile data.
  try {
    const hasAdminWrite = admin && admin.apps && admin.apps.length > 0 && admin.firestore
    const profile = { email: result.email, displayName: result.displayName, createdAt: Date.now() }
    if (hasAdminWrite) {
      // Write to Firestore using Admin SDK
      await admin.firestore().collection('users').doc(result.uid).set(profile)
      result.dbWrite = { provider: 'firestore', ok: true }
    } else {
      // Fallback: attempt Realtime Database REST write using idToken auth.
      const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      const dbCandidates = []
      if (projectId) {
        dbCandidates.push(`https://${projectId}.firebaseio.com`)
        dbCandidates.push(`https://${projectId}-default-rtdb.firebaseio.com`)
      }
      // also try using PROJECT_ID from firebase config if present in env
      const tryWrite = async (baseUrl) => {
        const url = `${baseUrl}/users/${result.uid}.json?auth=${result.idToken}`
        const r = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) })
        return r.ok
      }

      let written = false
      let used = null
      for (const base of dbCandidates) {
        try {
          const ok = await tryWrite(base)
          if (ok) { written = true; used = base; break }
        } catch (e) {
          // ignore and try next
        }
      }
      result.dbWrite = { provider: written ? 'realtime-db' : 'none', ok: written, endpoint: used }
    }
  } catch (e) {
    result.dbWrite = { provider: 'error', ok: false, message: e.message }
  }

  return result
}

module.exports = { login, signup }

