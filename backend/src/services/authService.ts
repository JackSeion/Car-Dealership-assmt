import { findByEmail, createUser } from '../repositories/userRepository';
import bcrypt from 'bcrypt';
import { RegisterInput } from '../validations/auth';
import { User } from '@prisma/client';

type PublicUser = Omit<User, 'password'>;

interface HttpError extends Error {
  status?: number;
}

export const register = async (payload: RegisterInput): Promise<PublicUser> => {
  const existing = await findByEmail(payload.email);
  if (existing) {
    const err = new Error('Email already exists') as HttpError;
    err.status = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(payload.password, 10);

  const user = await createUser({ name: payload.name, email: payload.email, password: hashed });

  // Do not return password
  const { password: _password, ...rest } = user;
  return rest;
};
