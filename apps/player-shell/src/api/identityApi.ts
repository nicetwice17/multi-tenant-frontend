import type { IIdentityApi, ILoginRequest, ILoginResponse } from './types'

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export function createIdentityApi(): IIdentityApi {
  return {
    async login({ email, password }: ILoginRequest): Promise<ILoginResponse> {
      await delay(800)

      if (!email || !password) {
        throw new Error('Email and password are required')
      }
      if (password === 'wrong') {
        throw new Error('Invalid credentials. Please try again.')
      }

      const token = `mock-jwt-${Date.now()}`
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify({ id: '1', name: 'Alex Johnson', email }))

      return {
        token,
        user: { id: '1', name: 'Alex Johnson', email },
      }
    },

    async logout(): Promise<void> {
      await delay(200)
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    },
  }
}
