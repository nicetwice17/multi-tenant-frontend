import { useState, useEffect, type FormEvent } from 'react'
import { useTenant } from '../context/TenantContext'
import { useApi } from '../context/ApiContext'
import { BillingStatus } from '../api/types'
import type { IBillingInfo } from '../api/types'
import { BrandButton, BrandCard } from 'theme-tenant-alpha'
import './BillingPage.css'

const STATUS_LABELS: Record<BillingStatus, string> = {
  [BillingStatus.Active]: 'Active',
  [BillingStatus.PastDue]: 'Past due',
  [BillingStatus.Cancelled]: 'Cancelled',
  [BillingStatus.Trialing]: 'Trial',
}

function validateAmount(raw: string): string | null {
  if (!raw.trim()) return 'Amount is required.'
  const n = Number(raw)
  if (isNaN(n) || !isFinite(n)) return 'Enter a valid number.'
  if (n <= 0) return 'Amount must be greater than 0.'
  if (n > 100_000) return 'Amount must not exceed 100,000.'
  return null
}

export function BillingPage() {
  const { tenant } = useTenant()
  const { billingApi } = useApi()

  const [info, setInfo] = useState<IBillingInfo | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'error' | 'empty' | 'ready'>('loading')
  const [loadError, setLoadError] = useState<string | null>(null)

  const [amountInput, setAmountInput] = useState('')
  const [amountError, setAmountError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    setLoadState('loading')
    billingApi
      .getBillingInfo()
      .then((data) => {
        if (!data) {
          setLoadState('empty')
          return
        }
        setInfo(data)
        setAmountInput(String(data.amount))
        setLoadState('ready')
      })
      .catch((err: unknown) => {
        setLoadError(err instanceof Error ? err.message : 'Failed to load billing info.')
        setLoadState('error')
      })
  }, [billingApi])

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaveSuccess(false)
    setSaveError(null)

    const err = validateAmount(amountInput)
    setAmountError(err)
    if (err) return

    setSaving(true)
    try {
      const updated = await billingApi.updateBillingAmount(Number(amountInput))
      setInfo(updated)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Update failed.')
    } finally {
      setSaving(false)
    }
  }

  const fmt = new Intl.NumberFormat(tenant.locale, {
    style: 'currency',
    currency: info?.currency ?? tenant.currency,
  })

  if (loadState === 'loading') {
    return (
      <div className="billing-page">
        <div className="billing-page__state billing-page__state--loading" aria-live="polite">
          <div className="billing-page__spinner" aria-hidden="true" />
          <p>Loading billing information…</p>
        </div>
      </div>
    )
  }

  if (loadState === 'error') {
    return (
      <div className="billing-page">
        <div className="billing-page__state billing-page__state--error" role="alert">
          <p className="billing-page__state-title">Failed to load billing</p>
          <p>{loadError}</p>
          <BrandButton
            variant="secondary"
            onClick={() => window.location.reload()}
          >
            Try again
          </BrandButton>
        </div>
      </div>
    )
  }

  if (loadState === 'empty' || !info) {
    return (
      <div className="billing-page">
        <div className="billing-page__state billing-page__state--empty">
          <p className="billing-page__state-title">No billing information</p>
          <p>You don't have any billing data yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="billing-page">
      <h1 className="billing-page__title">Billing</h1>

      <div className="billing-page__grid">
        <BrandCard header="Current Plan" variant="default">
          <dl className="billing-page__dl">
            <dt>Plan</dt>
            <dd>{info.currentPlan}</dd>
            <dt>Amount</dt>
            <dd data-testid="billing-amount">{fmt.format(info.amount)}</dd>
            <dt>Status</dt>
            <dd>
              <span className={`billing-page__badge billing-page__badge--${info.status}`}>
                {STATUS_LABELS[info.status]}
              </span>
            </dd>
            <dt>Next billing</dt>
            <dd>
              {new Intl.DateTimeFormat(tenant.locale).format(
                new Date(info.nextBillingDate)
              )}
            </dd>
          </dl>
        </BrandCard>

        <BrandCard
          header="Update Billing Amount"
          variant="default"
          footer={
            <BrandButton
              type="submit"
              form="billing-form"
              loading={saving}
              size="md"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </BrandButton>
          }
        >
          <form id="billing-form" onSubmit={handleSave} noValidate>
            {saveSuccess && (
              <div className="billing-page__alert billing-page__alert--success" role="status">
                Amount updated successfully.
              </div>
            )}
            {saveError && (
              <div className="billing-page__alert billing-page__alert--error" role="alert">
                {saveError}
              </div>
            )}
            <div className="billing-page__field">
              <label htmlFor="amount" className="billing-page__label">
                Monthly amount ({info.currency})
              </label>
              <input
                id="amount"
                type="number"
                min="1"
                max="100000"
                step="1"
                className={`billing-page__input ${amountError ? 'billing-page__input--error' : ''}`}
                value={amountInput}
                onChange={(e) => {
                  setAmountInput(e.target.value)
                  setAmountError(null)
                }}
                aria-describedby={amountError ? 'amount-error' : undefined}
                aria-invalid={Boolean(amountError)}
                disabled={saving}
              />
              {amountError && (
                <p id="amount-error" className="billing-page__field-error" role="alert">
                  {amountError}
                </p>
              )}
            </div>
          </form>
        </BrandCard>
      </div>
    </div>
  )
}
