import { LoginInput } from '../validations/auth';
import { findByEmail } from '../repositories/userRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createHttpError } from '../utils/errors';

export const login = async (payload: LoginInput): Promise<{ token: string }> => {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw createHttpError('JWT_SECRET is not configured',500);
  }

  const user = await findByEmail(payload.email);

  if (!user) {
    throw createHttpError('Invalid credentials', 401);
  }

  const valid = await bcrypt.compare(payload.password, user.password);

  if (!valid) {
    throw createHttpError('Invalid credentials', 401);
  }

  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

  return { token };
};