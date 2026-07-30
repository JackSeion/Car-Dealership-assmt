import { createContext, ReactNode, useContext, useState } from 'react'
import { AuthUser, LoginData, login as loginRequest } from '../services/authService'

const AUTH_TOKEN_KEY = 'authToken'

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (data: LoginData) => Promise<void>
  logout: () => void
}

type AuthProviderProps = {
  children: ReactNode
}

type JwtPayload = {
  sub: string
  email: string
  role?: string
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const getUserFromToken = (token: string): AuthUser | null => {
  try {
    const payload = token.split('.')[1]

    if (!payload) {
      return null
    }

    const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as JwtPayload

    return {
      id: decodedPayload.sub,
      email: decodedPayload.email,
      role: decodedPayload.role,
    }
  } catch {
    return null
  }
}

const getStoredUser = (): AuthUser | null => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)

  if (!token) {
    return null
  }

  const user = getUserFromToken(token)

  if (!user) {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }

  return user
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser)

  const login = async (data: LoginData) => {
    const { token } = await loginRequest(data)
    const authenticatedUser = getUserFromToken(token)

    if (!authenticatedUser) {
      throw new Error('Invalid authentication token')
    }

    localStorage.setItem(AUTH_TOKEN_KEY, token)
    setUser(authenticatedUser)
  }

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
