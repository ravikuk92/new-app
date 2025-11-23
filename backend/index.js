const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
app.use(cors())
app.use(express.json())

// Database connection via environment variables
const pool = new Pool({
  host: process.env.PGHOST || 'db',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'appdb',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
})

app.get('/api/hello', async (req, res) => {
  try {
    const r = await pool.query('SELECT message FROM sample LIMIT 1')
    if (r.rows.length) return res.json({ message: r.rows[0].message })
    return res.json({ message: 'No message in DB' })
  } catch (err) {
    console.error(err)
    return res.json({ message: 'DB error' })
  }
})

app.post('/api/feedback', async (req, res) => {
  try {
    const { name, password, feedback } = req.body
    if (!name || !password || !feedback) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const result = await pool.query(
      'INSERT INTO feedback (name, password, feedback) VALUES ($1, $2, $3) RETURNING id',
      [name, password, feedback]
    )
    return res.json({ 
      success: true, 
      message: 'Feedback saved successfully',
      id: result.rows[0].id 
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to save feedback' })
  }
})

app.get('/api/feedback', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, feedback, created_at FROM feedback ORDER BY created_at DESC'
    )
    return res.json({ 
      success: true, 
      data: result.rows 
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to retrieve feedback' })
  }
})

app.listen(3000, () => console.log('Backend listening on :3000'))
