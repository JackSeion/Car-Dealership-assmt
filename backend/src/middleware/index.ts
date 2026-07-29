import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const UNAUTHORIZED_RESPONSE = { message: 'Unauthorized' };
const NOT_FOUND_RESPONSE = { message: 'Not Found' };
const INTERNAL_SERVER_ERROR_RESPONSE = { message: 'Internal Server Error' };
const BEARER_PREFIX = 'Bearer ';

type ErrorWithStatus = {
  status?: number;
  message?: string;
};

const sendUnauthorized = (res: Response) => res.status(401).json(UNAUTHORIZED_RESPONSE);

const getAuthorizationHeader = (req: Request): string | undefined => {
  const header = req.headers.authorization;
  return typeof header === 'string' ? header : undefined;
};

const getBearerToken = (authorizationHeader: string): string | undefined => {
  if (!authorizationHeader.startsWith(BEARER_PREFIX)) {
    return undefined;
  }

  const token = authorizationHeader.slice(BEARER_PREFIX.length).trim();
  return token.length > 0 ? token : undefined;
};

const hasStatus = (value: unknown): value is ErrorWithStatus => {
  return !!value && typeof value === 'object' && 'status' in value;
};

export const notFound = (_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json(NOT_FOUND_RESPONSE);
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (hasStatus(err)) {
    return res.status(err.status || 500).json({ message: err.message || INTERNAL_SERVER_ERROR_RESPONSE.message });
  }

  return res.status(500).json(INTERNAL_SERVER_ERROR_RESPONSE);
};

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = getAuthorizationHeader(req);

  if (!authorizationHeader) {
    return sendUnauthorized(res);
  }

  const token = getBearerToken(authorizationHeader);

  if (!token) {
    return sendUnauthorized(res);
  }

  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    return sendUnauthorized(res);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === 'string') {
      return sendUnauthorized(res);
    }

    req.user = decoded as JwtPayload;
    return next();
  } catch {
    return sendUnauthorized(res);
  }
};
