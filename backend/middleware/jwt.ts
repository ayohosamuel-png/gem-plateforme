import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { User } from '../../src/types/index.js';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function jwtMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }

  const token = authHeader.replace('Bearer ', '');
  const user = AuthService.verifyToken(token);
  if (user) {
    req.user = user;
  }
  next();
}
