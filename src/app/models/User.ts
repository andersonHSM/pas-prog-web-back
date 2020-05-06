import {
  Model,
  DataTypes,
  HasManyHasAssociationsMixin,
  Association,
} from 'sequelize';

import { sequelize } from '../../database/index';

import { hash, compare } from 'bcrypt';

import Locations from './Locations';
import { HasManyGetAssociationsMixin } from 'sequelize';

class Users extends Model {
  id!: number;
  name!: string;
  password!: string;
  password_hash!: string;
  email!: string;

  readonly createdAt!: Date;
  readonly updatedAt!: Date;

  getLocations!: HasManyGetAssociationsMixin<Locations>;
  hasLocations!: HasManyHasAssociationsMixin<Locations, number>;

  checkPassword(password: string) {
    return compare(password, this.password_hash);
  }

  static associations: {
    locations: Association<Users, Locations>;
  };
}

Users.init(
  {
    name: DataTypes.STRING(100),

    email: DataTypes.STRING(50),

    password: DataTypes.VIRTUAL,

    password_hash: DataTypes.STRING(36),
  },
  { sequelize, tableName: 'Users' }
);

Users.addHook('beforeSave', async (user: any) => {
  if (user.password) {
    user.password_hash = await hash(user.password, 10);
  }
});

Users.hasMany(Locations, {
  sourceKey: 'id',
  foreignKey: 'user_id',
  as: 'locations',
});

export default Users;
