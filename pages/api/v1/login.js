const { login } = require('../../../lib/actions')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' })

  try {
    const data = await login({ email, password })
    return res.status(200).json({ success: true, data })
  } catch (err) {
    return res.status(401).json({ success: false, error: err.message || 'Unauthorized' })
  }
}
