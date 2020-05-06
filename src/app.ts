import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';

import './database/index';

import { routes } from './routes';

class App {
  private _server: Express;

  constructor() {
    this._server = express();

    this.middlewares();

    this.routes();
  }

  middlewares() {
    this._server.use(express.json());

    this._server.use(
      '/files/',
      express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
    );

    this._server.use(cors({ origin: true, credentials: true }));
  }

  routes() {
    this._server.use(routes);
  }

  get server(): Express {
    return this._server;
  }
}

export const { server } = new App();
