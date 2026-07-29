import { JwtPayload } from 'jsonwebtoken';

type AuthenticatedUser = JwtPayload & {
  role?: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
