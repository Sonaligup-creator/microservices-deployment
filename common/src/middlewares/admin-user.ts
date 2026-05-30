import type { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

export const adminUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.currentUser?.isAdmin !== true) {
    throw new NotAuthorizedError();
  }

  next();
};
