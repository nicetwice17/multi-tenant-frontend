import { createContext, useContext, useState, type ReactNode } from 'react'

export enum BrandId {
  Default = 'default',
  Alpha = 'alpha',
}

export interface ITenantConfig {
  brandId: BrandId
  locale: string
  currency: string
}

interface ITenantContextValue {
  tenant: ITenantConfig
  setTenant: (config: ITenantConfig) => void
}

const TenantContext = createContext<ITenantContextValue | null>(null)

const DEFAULT_TENANT: ITenantConfig = {
  brandId: BrandId.Default,
  locale: 'en-US',
  currency: 'USD',
}

function parseBrandId(value: string | null): BrandId {
  if (value && (Object.values(BrandId) as string[]).includes(value)) {
    return value as BrandId
  }
  return BrandId.Default
}

function resolveTenantFromUrl(): ITenantConfig {
  const params = new URLSearchParams(window.location.search)
  const brandId = parseBrandId(params.get('tenant'))
  const locale = params.get('locale') ?? DEFAULT_TENANT.locale
  const currency = params.get('currency') ?? DEFAULT_TENANT.currency
  return { brandId, locale, currency }
}

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<ITenantConfig>(resolveTenantFromUrl)

  return (
    <TenantContext.Provider value={{ tenant, setTenant }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant(): ITenantContextValue {
  const ctx = useContext(TenantContext)
  if (!ctx) throw new Error('useTenant must be used within TenantProvider')
  return ctx
}
