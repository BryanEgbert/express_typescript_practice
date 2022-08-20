import { DataTypes, Model, CreationOptional, InferCreationAttributes, InferAttributes } from 'sequelize';
import { IUser } from "../../interfaces/user.interface.js"
import { hashPassword } from '../../utils/passwordUtils.js';
import sequelizeConnection from '../config/index.js'

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> implements IUser {
  declare id: CreationOptional<string>;
  declare username: string;
  declare email: string;
  declare password: string;
  declare isSeller: CreationOptional<boolean>;
};

User.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
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
  },
  isSeller: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize: sequelizeConnection,
  modelName:  "users"
});