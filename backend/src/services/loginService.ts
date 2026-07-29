import { LoginInput } from '../validations/auth';
import { findByEmail } from '../repositories/userRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface HttpError extends Error {
  status?: number;
}

export const login = async (
  payload: LoginInput
): Promise<{ token: string }> => {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  const user = await findByEmail(payload.email);

  if (!user) {
    const err = new Error('Invalid credentials') as HttpError;
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(payload.password, user.password);

  if (!valid) {
    const err = new Error('Invalid credentials') as HttpError;
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: '1h',
    }
  );

  return { token };
};