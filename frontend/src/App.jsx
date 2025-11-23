import React, { useEffect, useState } from 'react'

export default function App() {
  const [message, setMessage] = useState('Loading...')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [feedback, setFeedback] = useState('')
  const [submitStatus, setSubmitStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedbackList, setFeedbackList] = useState([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [loadingFeedback, setLoadingFeedback] = useState(false)

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

  const handleRetrieveFeedback = async () => {
    setLoadingFeedback(true)
    setShowFeedback(true)
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000'
      const response = await fetch(`${backendUrl}/api/feedback`)
      const data = await response.json()
      
      if (data.success) {
        setFeedbackList(data.data)
      } else {
        setFeedbackList([])
      }
    } catch (err) {
      console.error('Error retrieving feedback:', err)
      setFeedbackList([])
    } finally {
      setLoadingFeedback(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>📝 Feedback App</h1>
        <p className="subtitle">Backend says: <span className="message">{message}</span></p>
      </header>

      <main className="main-content">
        <section className="form-section">
          <h2>Submit Your Feedback</h2>
          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="form-group">
              <label htmlFor="name">👤 Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">🔐 Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="feedback">💬 Feedback</label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts and feedback..."
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn btn-submit">
              {loading ? '⏳ Submitting...' : '✓ Submit Feedback'}
            </button>
          </form>

          {submitStatus && (
            <div className={`status ${submitStatus.includes('✓') ? 'success' : 'error'}`}>
              {submitStatus}
            </div>
          )}
        </section>

        <section className="feedback-list-section">
          <div className="section-header">
            <h2>📋 View All Feedback</h2>
            <button 
              onClick={handleRetrieveFeedback} 
              disabled={loadingFeedback}
              className="btn btn-retrieve"
            >
              {loadingFeedback ? '⏳ Loading...' : '🔄 Retrieve Feedback'}
            </button>
          </div>

          {showFeedback && (
            <div className="feedback-container">
              {loadingFeedback ? (
                <p className="loading">Loading feedback...</p>
              ) : feedbackList.length > 0 ? (
                <div className="feedback-cards">
                  {feedbackList.map((item) => (
                    <div key={item.id} className="feedback-card">
                      <div className="card-header">
                        <h3>👤 {item.name}</h3>
                        <span className="card-id">#{item.id}</span>
                      </div>
                      <p className="card-feedback">{item.feedback}</p>
                      <span className="card-date">
                        📅 {new Date(item.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No feedback yet. Be the first to submit!</p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
