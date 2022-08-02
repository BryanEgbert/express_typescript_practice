import { DataTypes, Model, Optional } from 'sequelize';
import { IUser } from "../../interfaces/user.interface.js"
import sequelizeConnection from '../config/config.js'

export class User extends Model implements IUser {
  id!: any;
  username!: string;
  email!: string;
  password!: string;
};

User.init({
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize: sequelizeConnection,
  tableName:  "users"
});