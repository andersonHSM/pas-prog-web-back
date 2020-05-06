import { Model, DataTypes } from 'sequelize';

import { sequelize } from '../../database/index';

class JwtBlacklist extends Model {
  id!: number;
  token!: string;

  readonly created_at!: Date;
  readonly updated_at!: Date;
}

JwtBlacklist.init(
  {
    token: DataTypes.STRING,
  },
  { sequelize, tableName: 'jwt_blacklist' }
);

export default JwtBlacklist;
