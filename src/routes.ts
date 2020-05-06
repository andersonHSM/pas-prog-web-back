import { Router, Request, Response, NextFunction } from 'express';

import UserController from './app/controllers/UserController';
import LocationController from './app/controllers/LocationController';
import { sessionController } from './app/controllers/SessionController';
import { authMiddleware } from './app/middlewares/AuthMiddleware';
import { jwtBlacklistController } from './app/controllers/JwtBlacklistController';

const routes = Router();

routes.post('/users/', UserController.store);

routes.post('/login/', sessionController.store);

routes.get('/locations/', LocationController.index);

routes.use(authMiddleware);

routes.post('/logout/', jwtBlacklistController.create);

routes.get('/user/:id/locations/', LocationController.listLocaleByUser);

routes.post('/locations/', LocationController.store);
routes.patch('/locations/:id/', LocationController.update);
routes.delete('/locations/:id/', LocationController.delete);

export { routes };
