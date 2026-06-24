import { useEffect, type ReactNode } from 'react'

interface IThemeProviderProps {
  tokens?: Record<string, string>
  children: ReactNode
}

/**
 * Applies brand theme tokens as CSS custom properties on <html>.
 * When `tokens` is undefined, the fallback CSS vars from fallback.css remain active.
 * Shell pages never import raw token files — they only read CSS vars.
 */
export function ThemeProvider({ tokens, children }: IThemeProviderProps) {
  useEffect(() => {
    if (!tokens) return
    const root = document.documentElement
    const keys = Object.keys(tokens)
    for (const key of keys) {
      root.style.setProperty(key, tokens[key] as string)
    }
    return () => {
      for (const key of keys) {
        root.style.removeProperty(key)
      }
    }
  }, [tokens])

  return <>{children}</>
}
