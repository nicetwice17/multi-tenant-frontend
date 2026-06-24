import { createContext, useContext, type ReactNode } from 'react'
import type { IBillingApi, IIdentityApi } from '../api/types'

interface IApiContextValue {
  identityApi: IIdentityApi
  billingApi: IBillingApi
}

const ApiContext = createContext<IApiContextValue | null>(null)

interface IApiProviderProps extends IApiContextValue {
  children: ReactNode
}

export function ApiProvider({ identityApi, billingApi, children }: IApiProviderProps) {
  return (
    <ApiContext.Provider value={{ identityApi, billingApi }}>
      {children}
    </ApiContext.Provider>
  )
}

export function useApi(): IApiContextValue {
  const ctx = useContext(ApiContext)
  if (!ctx) throw new Error('useApi must be used within ApiProvider')
  return ctx
}
