const admin = require('../../../lib/firebaseAdmin')

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const auth = req.headers.authorization || ''
  const m = auth.match(/^Bearer\s+(.*)$/i)
  if (!m) return res.status(401).json({ error: 'Missing Authorization header' })
  const idToken = m[1]

  try {
    const decoded = await admin.auth().verifyIdToken(idToken)
    const uid = decoded.uid
    const doc = await admin.firestore().collection('users').doc(uid).get()
    if (!doc.exists) return res.status(404).json({ error: 'Profile not found' })
    const data = doc.data()
    return res.status(200).json({ success: true, data })
  } catch (err) {
    return res.status(401).json({ error: err.message || 'Unauthorized' })
  }
}
