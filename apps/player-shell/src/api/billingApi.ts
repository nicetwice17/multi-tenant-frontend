import { BillingStatus } from './types'
import type { IBillingApi, IBillingInfo } from './types'

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const mockBillingData: IBillingInfo = {
  currentPlan: 'Pro',
  amount: 99,
  currency: 'USD',
  nextBillingDate: '2026-07-24',
  status: BillingStatus.Active,
}

export function createBillingApi(): IBillingApi {
  let current = { ...mockBillingData }

  return {
    async getBillingInfo(): Promise<IBillingInfo> {
      await delay(600)
      return { ...current }
    },

    async updateBillingAmount(amount: number): Promise<IBillingInfo> {
      await delay(500)
      if (amount <= 0) {
        throw new Error('Billing amount must be greater than zero.')
      }
      if (amount > 100_000) {
        throw new Error('Billing amount exceeds the maximum allowed value.')
      }
      current = { ...current, amount }
      return { ...current }
    },
  }
}
