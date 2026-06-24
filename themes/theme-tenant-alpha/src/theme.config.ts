export const themeTokens = {
  '--color-primary': '#6366f1',
  '--color-primary-hover': '#4f46e5',
  '--color-primary-text': '#ffffff',
  '--color-surface': '#ffffff',
  '--color-surface-secondary': '#f5f3ff',
  '--color-surface-hover': '#ede9fe',
  '--color-text': '#1e1b4b',
  '--color-text-muted': '#6b7280',
  '--color-text-inverse': '#ffffff',
  '--color-border': '#e0e7ff',
  '--color-error': '#ef4444',
  '--color-error-bg': '#fef2f2',
  '--color-success': '#22c55e',
  '--color-success-bg': '#f0fdf4',
  '--radius-sm': '6px',
  '--radius-md': '12px',
  '--radius-lg': '16px',
  '--font-family': "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
  '--shadow-sm': '0 1px 3px rgba(99, 102, 241, 0.1)',
  '--shadow-md': '0 4px 12px rgba(99, 102, 241, 0.15)',
  '--shadow-lg': '0 10px 25px rgba(99, 102, 241, 0.2)',
} as const

export type ThemeTokens = typeof themeTokens
export type ThemeTokenKey = keyof ThemeTokens

export const themeConfig = {
  id: 'tenant-alpha',
  displayName: 'Alpha Brand',
  tokens: themeTokens,
} as const

export type ThemeConfig = typeof themeConfig
