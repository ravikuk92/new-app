import React, { useEffect, useState } from 'react'

export default function App() {
  const [message, setMessage] = useState('Loading...')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [feedback, setFeedback] = useState('')
  const [submitStatus, setSubmitStatus] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000'
    fetch(`${backendUrl}/api/hello`)
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage('Could not reach backend'))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSubmitStatus('')

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000'
      const response = await fetch(`${backendUrl}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          password,
          feedback,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus('✓ Feedback submitted successfully!')
        setName('')
        setPassword('')
        setFeedback('')
      } else {
        setSubmitStatus('✗ Error: ' + (data.error || 'Failed to submit'))
      }
    } catch (err) {
      setSubmitStatus('✗ Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>New App (React)</h1>
      <p>Backend says: {message}</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Feedback: </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {submitStatus && <p className="status">{submitStatus}</p>}
    </div>
  )
}
