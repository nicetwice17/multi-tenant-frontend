import { Link, useNavigate } from 'react-router-dom'
import { BrandId, useTenant } from '../context/TenantContext'
import { useApi } from '../context/ApiContext'
import './Layout.css'

interface ILayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: ILayoutProps) {
  const { tenant, setTenant } = useTenant()
  const { identityApi } = useApi()
  const navigate = useNavigate()

  const isLoggedIn = Boolean(localStorage.getItem('auth_token'))

  async function handleLogout() {
    await identityApi.logout()
    navigate('/auth/login')
  }

  function toggleTheme() {
    setTenant({
      ...tenant,
      brandId: tenant.brandId === BrandId.Alpha ? BrandId.Default : BrandId.Alpha,
    })
  }

  return (
    <div className="layout">
      <header className="layout__header">
        <nav className="layout__nav">
          <Link to="/" className="layout__logo">
            {tenant.brandId === BrandId.Alpha ? 'Alpha' : 'Player'} Shell
          </Link>
          <div className="layout__nav-links">
            <Link to="/">Home</Link>
            {isLoggedIn && <Link to="/account/billing">Billing</Link>}
          </div>
          <div className="layout__nav-actions">
            <button
              className="layout__theme-toggle"
              onClick={toggleTheme}
              title={`Switch to ${tenant.brandId === BrandId.Alpha ? BrandId.Default : BrandId.Alpha} theme`}
              aria-label="Toggle theme"
            >
              Theme: <strong>{tenant.brandId}</strong>
            </button>

            {isLoggedIn ? (
              <button className="layout__btn layout__btn--ghost" onClick={handleLogout}>
                Log out
              </button>
            ) : (
              <Link to="/auth/login" className="layout__btn layout__btn--primary">
                Log in
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className="layout__main">{children}</main>
      <footer className="layout__footer">
        <p>
          Tenant: <code>{tenant.brandId}</code> &middot; Locale:{' '}
          <code>{tenant.locale}</code> &middot; Currency: <code>{tenant.currency}</code>
        </p>
      </footer>
    </div>
  )
}
