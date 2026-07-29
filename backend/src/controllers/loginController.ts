import { Request, Response } from 'express';
import { login as loginService } from '../services/loginService';
import { loginSchema, LoginInput } from '../validations/auth';
import { ZodError } from 'zod';
import { isHttpError } from '../utils/errors';

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.parse(req.body) as LoginInput;
    const payload = await loginService(parsed);
    return res.status(200).json(payload);
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues.map((i) => i.message).join(', ') });
    }

    if (isHttpError(err)) {
      return res.status(err.status || 500).json({ message: err.message || 'Error' });
    }

    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
