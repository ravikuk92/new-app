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

app.listen(3000, () => console.log('Backend listening on :3000'))
