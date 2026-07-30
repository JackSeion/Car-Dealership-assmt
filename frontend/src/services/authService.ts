import api from './api'

export type RegisterData = {
  name: string
  email: string
  password: string
}

export type LoginData = {
  email: string
  password: string
}

export type AuthUser = {
  id: string
  email: string
  role?: string
}

export type LoginResponse = {
  token: string
}

export const register = async (data: RegisterData) => {
  const response = await api.post('/api/auth/register', data)
  return response.data
}

export const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/api/auth/login', data)
  return response.data
}
