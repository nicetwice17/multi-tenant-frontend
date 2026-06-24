import { Link } from 'react-router-dom'
import { useTenant } from '../context/TenantContext'
import { BrandButton } from 'theme-tenant-alpha'
import { BrandCard } from 'theme-tenant-alpha'
import './HomePage.css'

export function HomePage() {
  const { tenant } = useTenant()
  const isLoggedIn = Boolean(localStorage.getItem('auth_token'))

  return (
    <div className="home">
      <section className="home__hero">
        <h1 className="home__title">Welcome to Player Shell</h1>
        <p className="home__subtitle">
          A multi-tenant frontend architecture demo. Current brand:{' '}
          <strong>{tenant.brandId}</strong>
        </p>
        <div className="home__cta">
          {isLoggedIn ? (
            <BrandButton as={Link} onClick={() => void 0} size="lg">
              <Link to="/account/billing" className="home__cta-link">
                View Billing
              </Link>
            </BrandButton>
          ) : (
            <Link to="/auth/login">
              <BrandButton size="lg">Get Started</BrandButton>
            </Link>
          )}
        </div>
      </section>

      <section className="home__cards">
        <BrandCard header="Tenant Context" variant="default">
          <dl className="home__dl">
            <dt>Brand ID</dt>
            <dd><code>{tenant.brandId}</code></dd>
            <dt>Locale</dt>
            <dd><code>{tenant.locale}</code></dd>
            <dt>Currency</dt>
            <dd><code>{tenant.currency}</code></dd>
          </dl>
        </BrandCard>

        <BrandCard header="Navigation" variant="default">
          <ul className="home__links">
            <li>
              <Link to="/">/ — Home page</Link>
            </li>
            <li>
              <Link to="/auth/login">/auth/login — Login</Link>
            </li>
            <li>
              <Link to="/account/billing">/account/billing — Billing</Link>
            </li>
          </ul>
          <p className="home__hint">
            Use the <strong>Theme</strong> toggle in the header to switch between
            default and alpha brand themes.
          </p>
        </BrandCard>

        <BrandCard header="Theme Switch" variant="elevated">
          <p>
            Append <code>?tenant=alpha</code> to the URL to start with the Alpha
            brand, or use the toggle button in the header. Theme changes apply
            without touching any feature code.
          </p>
        </BrandCard>
      </section>
    </div>
  )
}
