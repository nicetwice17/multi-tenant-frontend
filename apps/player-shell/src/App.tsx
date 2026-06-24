import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BrandId, TenantProvider, useTenant } from './context/TenantContext'
import { ApiProvider } from './context/ApiContext'
import { ThemeProvider } from './theme/ThemeProvider'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { BillingPage } from './pages/BillingPage'
import { createIdentityApi } from './api/identityApi'
import { createBillingApi } from './api/billingApi'
import { themeConfig } from 'theme-tenant-alpha'

const identityApi = createIdentityApi()
const billingApi = createBillingApi()

function ThemedApp() {
  const { tenant } = useTenant()
  const tokens = tenant.brandId === BrandId.Alpha ? themeConfig.tokens : undefined

  return (
    <ThemeProvider tokens={tokens}>
      <ApiProvider identityApi={identityApi} billingApi={billingApi}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route
                path="/account/billing"
                element={
                  <ProtectedRoute>
                    <BillingPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ApiProvider>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <TenantProvider>
      <ThemedApp />
    </TenantProvider>
  )
}
