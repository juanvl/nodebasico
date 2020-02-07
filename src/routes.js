import { Router } from 'express';
import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

import * as UserValidator from './app/validators/UserValidator';
import * as SessionValidator from './app/validators/SessionValidator';

const routes = new Router();

const bruteStore = new BruteRedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const bruteForce = new Brute(bruteStore);

routes.post('/users', UserValidator.store, UserController.store);
routes.post(
  '/sessions',
  bruteForce.prevent,
  SessionValidator.store,
  SessionController.store
);

routes.use(authMiddleware);

routes.put('/users', UserValidator.update, UserController.update);

export default routes;
