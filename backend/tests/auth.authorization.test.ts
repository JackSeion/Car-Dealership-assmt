import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as middlewareIndex from '../src/middleware';

// The middleware is not implemented yet; these tests are written to fail
// until a reusable role-based authorization middleware is provided.
const authorizeRoles = (middlewareIndex as any).authorizeRoles;

const authSecret = process.env.JWT_SECRET || 'dev-secret';

const makeRes = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res as Response);
  res.json = jest.fn().mockReturnValue(res as Response);
  return res as Response;
};

const makeAuthenticatedReq = (role: 'ADMIN' | 'USER'): Partial<Request> => {
  const user = {
    sub: 'user-id-123',
    email: `${role.toLowerCase()}@example.com`,
    role,
  };

  const token = jwt.sign(user, authSecret, { expiresIn: '1h' });

  return {
    headers: { authorization: `Bearer ${token}` } as any,
    user: user as any,
  };
};

describe('role-based authorization middleware (TDD failing tests)', () => {
  it('allows an ADMIN user to proceed', async () => {
    const middleware = authorizeRoles('ADMIN');
    const req = makeAuthenticatedReq('ADMIN');
    const res = makeRes();
    const next: NextFunction = jest.fn();

    await middleware(req as Request, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('returns 403 when a USER accesses an admin-only route', async () => {
    const middleware = authorizeRoles('ADMIN');
    const req = makeAuthenticatedReq('USER');
    const res = makeRes();
    const next: NextFunction = jest.fn();

    await middleware(req as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when the Authorization header is missing', async () => {
    const middleware = authorizeRoles('ADMIN');
    const req = {
      headers: {},
    } as Partial<Request>;
    const res = makeRes();
    const next: NextFunction = jest.fn();

    await middleware(req as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when the JWT is invalid', async () => {
    const middleware = authorizeRoles('ADMIN');
    const req = {
      headers: { authorization: 'Bearer invalid.token.here' },
    } as Partial<Request>;
    const res = makeRes();
    const next: NextFunction = jest.fn();

    await middleware(req as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
