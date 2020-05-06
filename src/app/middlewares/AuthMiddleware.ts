import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import { tokenSecurityKey } from '../../config/auth';

import { SignedRequest } from '../interfaces/SignedRequest';

import JwtBlacklist from '../models/JwtBlacklist';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<JSON> | void> {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ error: 'Token not provided.' });
  }

  const [, token] = authHeader.split(' ');

  const blacklistedToken = await JwtBlacklist.findOne({
    where: { token },
    attributes: ['id', 'token'],
  });

  if (blacklistedToken) {
    return res
      .status(401)
      .json({ error: 'Provided token is no longer valid.' });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, tokenSecurityKey);

    (req as SignedRequest).userId = (decoded as any).id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
}
