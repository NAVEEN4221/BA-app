const { signup } = require('../../../lib/actions')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' })

  try {
    const data = await signup({ name, email, password })
    return res.status(201).json({ success: true, data })
  } catch (err) {
    const status = err.message && err.message.includes('already') ? 409 : 400
    return res.status(status).json({ success: false, error: err.message || 'Signup failed' })
  }
}
