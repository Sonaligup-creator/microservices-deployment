import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import type { UserPayload } from '../types/user-payload';

interface RequestWithSession extends Request {
  session?: {
    jwt?: string;
  };
}

export const currentUser = (
  req: RequestWithSession,
  res: Response,
  next: NextFunction
): void => {
  if (req.session?.jwt == null) {
    next();
    return;
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
    req.currentUser = payload;
  } catch (err) {
    // Ignore invalid tokens and move on.
  }

  next();
};
