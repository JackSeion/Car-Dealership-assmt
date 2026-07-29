import { findByEmail, createUser } from '../repositories/userRepository';
import bcrypt from 'bcrypt';

export const register = async (payload: { name: string; email: string; password: string }) => {
  const existing = await findByEmail(payload.email);
  if (existing) {
    const err: any = new Error('Email already exists');
    err.status = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(payload.password, 10);

  const user = await createUser({name: payload.name, email: payload.email, password: hashed });

  // Do not return password
  const { password, ...rest } = (user as any) || {};
  return rest;
};
