import { Request, Response } from 'express';
import { login as loginService } from '../services/loginService';
import { loginSchema } from '../validations/auth';
import { ZodError } from 'zod';
import { isHttpError } from '../utils/errors';

export const login = async (req: Request, res: Response) => {
  try {
    const payload = await loginService(loginSchema.parse(req.body));
    return res.status(200).json(payload);
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      const message = err.issues.map((issue) => issue.message).join(', ');
      return res.status(400).json({ message });
    }

    if (isHttpError(err)) {
      return res.status(err.status || 500).json({ message: err.message || 'Error' });
    }

    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
