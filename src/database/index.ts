import { Sequelize, Options } from 'sequelize';

import dbConfig from '../config/database.json';


export class Database {
  sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize(dbConfig['development'] as unknown as Options);
  }
}

export const { sequelize } = new Database();
