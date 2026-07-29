import { Request, Response } from 'express';
import { register as registerService } from '../services/authService';
import { registerSchema } from '../validations/auth';
import { ZodError } from 'zod';

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.parse(req.body);
    const user = await registerService(parsed);
    return res.status(201).json(user);
  } catch (err: any) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.issues.map((issue) => issue.message).join(', ') });
    }

    if (err.status) {
      return res.status(err.status).json({ message: err.message });
    }

    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
