import { DataTypes, Model, CreationOptional, InferCreationAttributes, InferAttributes, ForeignKey } from 'sequelize';
import { IUser } from "../../interfaces/user.interface.js"
import { hashPassword } from '../../utils/passwordUtils.js';
import sequelizeConnection from '../config/index.js'
import { User } from './user.model.js';

export class RefreshToken extends Model<InferAttributes<RefreshToken>, InferCreationAttributes<RefreshToken>> {
	declare userId: ForeignKey<string>;
	declare refreshToken: string;
	declare expiryDate: string;
};

RefreshToken.init({
	refreshToken: {
		type: DataTypes.TEXT,
	},
	expiryDate: {
		type: DataTypes.TEXT
	}
}, {
	sequelize: sequelizeConnection,
	modelName: "refreshToken"
});

User.hasMany(RefreshToken, {
	foreignKey: { allowNull: true },
	onDelete: "CASCADE",
	onUpdate: "CASCADE"
});

RefreshToken.belongsTo(User);
