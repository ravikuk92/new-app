import React, { useEffect, useState } from 'react'

export default function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://backend:3000'
    fetch(`${backendUrl}/api/hello`)
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage('Could not reach backend'))
  }, [])

  return (
    <div className="app">
      <h1>New App (React)</h1>
      <p>Backend says: {message}</p>
    </div>
  )
}
