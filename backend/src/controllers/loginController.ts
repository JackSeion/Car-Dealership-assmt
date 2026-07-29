import { Request, Response } from 'express';
import { login as loginService } from '../services/loginService';
import { loginSchema } from '../validations/auth';
import { ZodError } from 'zod';

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const payload = await loginService(parsed);
    return res.status(200).json(payload);
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues.map((i) => i.message).join(', ') });
    }

    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status?: number; message?: string };
      return res.status(e.status || 500).json({ message: e.message || 'Error' });
    }

    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
