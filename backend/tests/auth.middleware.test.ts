import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as middlewareIndex from '../src/middleware';


// The middleware is not implemented yet; these tests are written to fail
// until an `auth` middleware is provided at src/middleware (exported from index or as auth).
const authMiddleware = (middlewareIndex as any).auth;

const makeReq = (authHeader?: string): Partial<Request> => ({
  headers: authHeader ? { authorization: authHeader } as any : {}
});

const makeRes = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res as Response);
  res.json = jest.fn().mockReturnValue(res as Response);
  return res as Response;
};

describe('JWT auth middleware (TDD failing tests)', () => {
  it('returns 401 when Authorization header is missing', async () => {
    const req = makeReq();
    const res = makeRes();
    const next: NextFunction = jest.fn();

    await (authMiddleware as any)(req as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 for malformed Authorization header', async () => {
    const req = makeReq('BadHeader token');
    const res = makeRes();
    const next: NextFunction = jest.fn();

    await (authMiddleware as any)(req as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 for invalid JWT', async () => {
    const req = makeReq('Bearer invalid.token.here');
    const res = makeRes();
    const next: NextFunction = jest.fn();

    await (authMiddleware as any)(req as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next and attaches user for valid JWT', async () => {
    const payload = { sub: 'user-id-123', email: 'user@example.com' };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '1h' });
    const req = makeReq(`Bearer ${token}`);
    const res = makeRes();
    const next: NextFunction = jest.fn();

    await (authMiddleware as any)(req as Request, res, next);

    expect(next).toHaveBeenCalled();
    // middleware should attach `user` (or similar) to request
    expect((req as any).user).toBeDefined();
    expect((req as any).user.email).toBe(payload.email);
  });
});
