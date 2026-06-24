import type { ButtonHTMLAttributes } from 'react'
import './BrandButton.css'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface IBrandButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
}

export function BrandButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...rest
}: IBrandButtonProps) {
  const classes = [
    'brand-btn',
    `brand-btn--${variant}`,
    `brand-btn--${size}`,
    fullWidth ? 'brand-btn--full' : '',
    loading ? 'brand-btn--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading && <span className="brand-btn__spinner" aria-hidden="true" />}
      <span className="brand-btn__label">{children}</span>
    </button>
  )
}
