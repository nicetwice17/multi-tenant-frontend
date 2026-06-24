import type { HTMLAttributes } from 'react'
import './BrandCard.css'

type CardVariant = 'default' | 'elevated' | 'bordered'

interface IBrandCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  header?: string
  footer?: React.ReactNode
  padding?: 'sm' | 'md' | 'lg'
}

export function BrandCard({
  variant = 'default',
  header,
  footer,
  padding = 'md',
  children,
  className = '',
  ...rest
}: IBrandCardProps) {
  const classes = [
    'brand-card',
    `brand-card--${variant}`,
    `brand-card--pad-${padding}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} {...rest}>
      {header && (
        <div className="brand-card__header">
          <h3 className="brand-card__title">{header}</h3>
        </div>
      )}
      <div className="brand-card__body">{children}</div>
      {footer && <div className="brand-card__footer">{footer}</div>}
    </div>
  )
}
