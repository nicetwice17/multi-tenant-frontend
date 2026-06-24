import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { BillingPage } from './BillingPage'
import { ApiProvider } from '../context/ApiContext'
import { TenantProvider } from '../context/TenantContext'
import { BillingStatus } from '../api/types'
import type { IBillingApi, IIdentityApi } from '../api/types'

const mockIdentityApi: IIdentityApi = {
  login: vi.fn(),
  logout: vi.fn(),
}

function makeBillingApi(overrides?: Partial<IBillingApi>): IBillingApi {
  return {
    getBillingInfo: vi.fn().mockResolvedValue({
      currentPlan: 'Pro',
      amount: 99,
      currency: 'USD',
      nextBillingDate: '2026-07-24',
      status: BillingStatus.Active,
    }),
    updateBillingAmount: vi.fn().mockImplementation(async (amount: number) => ({
      currentPlan: 'Pro',
      amount,
      currency: 'USD',
      nextBillingDate: '2026-07-24',
      status: BillingStatus.Active,
    })),
    ...overrides,
  }
}

function renderBillingPage(billingApi: BillingApi) {
  return render(
    <MemoryRouter>
      <TenantProvider>
        <ApiProvider identityApi={mockIdentityApi} billingApi={billingApi}>
          <BillingPage />
        </ApiProvider>
      </TenantProvider>
    </MemoryRouter>
  )
}

describe('BillingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    const api = makeBillingApi({
      getBillingInfo: vi.fn(() => new Promise(() => {})),
    })
    renderBillingPage(api)
    expect(screen.getByText(/loading billing/i)).toBeInTheDocument()
  })

  it('renders billing info after successful fetch', async () => {
    renderBillingPage(makeBillingApi())
    await waitFor(() => expect(screen.getByText('Pro')).toBeInTheDocument())
    expect(screen.getByTestId('billing-amount')).toHaveTextContent('$99')
    expect(screen.getByText(/active/i)).toBeInTheDocument()
  })

  it('shows error state when fetch fails', async () => {
    const api = makeBillingApi({
      getBillingInfo: vi.fn().mockRejectedValue(new Error('Network error')),
    })
    renderBillingPage(api)
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
    expect(screen.getByText(/network error/i)).toBeInTheDocument()
  })

  it('validates empty billing amount', async () => {
    const user = userEvent.setup()
    renderBillingPage(makeBillingApi())
    await waitFor(() => expect(screen.getByLabelText(/monthly amount/i)).toBeInTheDocument())

    const input = screen.getByLabelText(/monthly amount/i)
    await user.clear(input)
    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(screen.getByText(/amount is required/i)).toBeInTheDocument()
  })

  it('validates negative billing amount', async () => {
    const user = userEvent.setup()
    renderBillingPage(makeBillingApi())
    await waitFor(() => expect(screen.getByLabelText(/monthly amount/i)).toBeInTheDocument())

    const input = screen.getByLabelText(/monthly amount/i)
    await user.clear(input)
    await user.type(input, '-5')
    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(screen.getByText(/greater than 0/i)).toBeInTheDocument()
  })

  it('updates billing amount successfully', async () => {
    const user = userEvent.setup()
    const api = makeBillingApi()
    renderBillingPage(api)
    await waitFor(() => expect(screen.getByLabelText(/monthly amount/i)).toBeInTheDocument())

    const input = screen.getByLabelText(/monthly amount/i)
    await user.clear(input)
    await user.type(input, '149')
    await user.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() =>
      expect(screen.getByText(/updated successfully/i)).toBeInTheDocument()
    )
    expect(api.updateBillingAmount).toHaveBeenCalledWith(149)
  })
})
