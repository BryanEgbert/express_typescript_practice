import { DataTypes, Model, CreationOptional, InferCreationAttributes, InferAttributes } from 'sequelize';
import { IUser } from "../../interfaces/user.interface.js"
import sequelizeConnection from '../config/index.js'

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<any>;
  declare username: string;
  declare email: string;
  declare password: string;
};

User.init({
  id: {
    type: DataTypes.UUID,
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
  modelName:  "users"
});