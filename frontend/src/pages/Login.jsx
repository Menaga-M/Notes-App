import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/ContextProvider'
import { apiUrl } from '../api'

const Login = () => {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const togglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const response = await axios.post(apiUrl('/api/auth/login'), {
        email,
        password,
      })
      if (response.data.success) {
        localStorage.setItem('token', response.data.token)
        // Accept the current API response and the older `existingUser` response
        // while the backend server is being restarted during development.
        setUser(response.data.user ?? response.data.existingUser)
        navigate('/dashboard')
      }
    } catch (error) {
      console.error(error)
      if (error.response?.status === 502) {
        setErrorMessage('The app server is unavailable. Start the backend on port 5000 and try again.')
      } else {
        setErrorMessage(error.response?.data?.message || 'Unable to sign in. Please check your details and try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-icon">🔐</div>
          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">
            Sign in to manage your notes, access your workspace, and continue where you left off.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {errorMessage && <p className="login-error" role="alert">{errorMessage}</p>}

          <button type="submit" className="login-button" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="login-footer">
          Don’t have an account? <Link to="/register">Signup</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
