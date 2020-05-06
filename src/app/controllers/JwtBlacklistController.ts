import { Response } from 'express';

import { SignedRequest } from '../interfaces/SignedRequest';
import { stringify } from 'querystring';

import JwtBlacklist from '../models/JwtBlacklist';

class JwtBlacklistController {
  async create(req: SignedRequest, res: Response) {
    const authHeader = req.headers.authorization!;

    const [, token] = authHeader.split(' ');

    const existintToken = await JwtBlacklist.findOne({ where: { token } });

    if (existintToken) {
      return res.status(400).json({ error: 'Already invalidated token.' });
    }

    const registredToken = await JwtBlacklist.create({ token });

    return res.status(200).json({ sucess: 'Sucessfully logged out.' });
  }
}

export const jwtBlacklistController = new JwtBlacklistController();
