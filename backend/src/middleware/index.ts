import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Not Found' });
};

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  // minimal error handler for tests; no business logic implemented
  if (err && typeof err === 'object' && 'status' in err) {
    const e = err as { status?: number; message?: string };
    const status = e.status || 500;
    return res.status(status).json({ message: e.message || 'Internal Server Error' });
  }

  return res.status(500).json({ message: 'Internal Server Error' });
};
