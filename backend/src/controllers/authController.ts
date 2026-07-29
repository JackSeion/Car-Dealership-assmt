import { Request, Response } from 'express';
import { register as registerService } from '../services/authService';
import { registerSchema } from '../validations/auth';
import { ZodError } from 'zod';
import { RegisterInput } from '../validations/auth';

interface HttpError {
  status?: number;
  message?: string;
}

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.parse(req.body) as RegisterInput;
    const user = await registerService(parsed);
    return res.status(201).json(user);
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues.map((issue) => issue.message).join(', ') });
    }

    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as HttpError;
      return res.status(e.status || 500).json({ message: e.message || 'Error' });
    }

    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
