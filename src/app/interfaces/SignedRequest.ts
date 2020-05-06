import { Request } from 'express';

export interface SignedRequest extends Request {
  userId?: number;
}
