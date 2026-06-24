import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApi } from '../context/ApiContext'
import { BrandButton } from 'theme-tenant-alpha'
import './LoginPage.css'

interface IFormErrors {
  email?: string
  password?: string
}

function validateForm(email: string, password: string): IFormErrors {
  const errors: IFormErrors = {}
  if (!email) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (!password) {
    errors.password = 'Password is required.'
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  }
  return errors
}

export function LoginPage() {
  const { identityApi } = useApi()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<IFormErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setApiError(null)

    const validationErrors = validateForm(email, password)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setLoading(true)
    try {
      await identityApi.login({ email, password })
      navigate('/')
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-page__card">
        <h1 className="login-page__title">Sign in</h1>
        <p className="login-page__subtitle">
          Use any email &amp; a password of 8+ characters. <br />
          <small>(Use password "wrong" to test the error state)</small>
        </p>

        <form className="login-page__form" onSubmit={handleSubmit} noValidate>
          {apiError && (
            <div className="login-page__alert" role="alert">
              {apiError}
            </div>
          )}

          <div className="login-page__field">
            <label htmlFor="email" className="login-page__label">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className={`login-page__input ${errors.email ? 'login-page__input--error' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={Boolean(errors.email)}
              disabled={loading}
            />
            {errors.email && (
              <p id="email-error" className="login-page__field-error" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="login-page__field">
            <label htmlFor="password" className="login-page__label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`login-page__input ${errors.password ? 'login-page__input--error' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              aria-describedby={errors.password ? 'password-error' : undefined}
              aria-invalid={Boolean(errors.password)}
              disabled={loading}
            />
            {errors.password && (
              <p id="password-error" className="login-page__field-error" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          <BrandButton
            type="submit"
            fullWidth
            loading={loading}
            size="lg"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </BrandButton>
        </form>

        <p className="login-page__footer">
          <Link to="/">Back to home</Link>
        </p>
      </div>
    </div>
  )
}
