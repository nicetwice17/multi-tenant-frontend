/* ── Identity API ─────────────────────────────────────────── */

export interface ILoginRequest {
  email: string
  password: string
}

export interface IAuthUser {
  id: string
  name: string
  email: string
}

export interface ILoginResponse {
  token: string
  user: IAuthUser
}

export interface IIdentityApi {
  login(req: ILoginRequest): Promise<ILoginResponse>
  logout(): Promise<void>
}

/* ── Billing API ──────────────────────────────────────────── */

export enum BillingStatus {
  Active = 'active',
  PastDue = 'past_due',
  Cancelled = 'cancelled',
  Trialing = 'trialing',
}

export interface IBillingInfo {
  currentPlan: string
  amount: number
  currency: string
  nextBillingDate: string
  status: BillingStatus
}

export interface IBillingApi {
  getBillingInfo(): Promise<IBillingInfo>
  updateBillingAmount(amount: number): Promise<IBillingInfo>
}
