import { Request, Response } from 'express';
import Joi from '@hapi/joi';

import jwt from 'jsonwebtoken';

import Users from '../models/User';
import { tokenSecurityKey, tokenExpirationTime } from '../../config/auth';
import { isDate } from 'util';

class SessionController {
  async store(req: Request, res: Response) {
    const invalidUserError = { error: 'Invalid e-mail or password.' };

    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().pattern(new RegExp('^[\\w]{3,30}')).required(),
    });

    const { email, password } = req.body;

    try {
      await schema.validateAsync({ email, password });
    } catch (error) {
      return res.status(400).json({ error: 'Please, verify inserted data.' });
    }

    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json(invalidUserError);
    }

    if (user) {
      const passwordMatches = await user.checkPassword(password);

      if (!passwordMatches) {
        return res.status(401).json(invalidUserError);
      }
    }

    const { id, name } = user;

    const token = jwt.sign({ id: user.id }, tokenSecurityKey, {
      expiresIn: tokenExpirationTime,
    });

    return res.json({ id, name, email, token });
  }
}

export const sessionController = new SessionController();
