import { Request, Response } from 'express';
import Users from '../models/User';

import { SignedRequest } from '../interfaces/SignedRequest';
import Locations from '../models/Locations';

class UserController {
  async store(req: Request, res: Response) {
    const previousUser = await Users.findOne({
      where: { email: req.body.email },
    });

    if (previousUser) {
      console.log(await previousUser.checkPassword(req.body.password));
      return res.status(401).json({ error: 'User already exists' });
    }

    const user = await Users.create(req.body);

    if (!user) {
      return res.status(400).json({ error: 'Unable to create user' });
    }

    const { id, name, email } = user;

    return res.status(200).json({ user: { id, name, email } });
  }
}

export default new UserController();
