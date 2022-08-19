import { DataTypes, Model, CreationOptional, InferCreationAttributes, InferAttributes, ForeignKey } from 'sequelize';
import sequelizeConnection from '../config/index.js'
import { User } from './user.model.js';

export class Shop extends Model<InferAttributes<Shop>, InferCreationAttributes<Shop>> {
	declare id: CreationOptional<string>;
	declare userId: ForeignKey<string>;
	declare name: string;
	declare description: string;
};

Shop.init({
id: {
		type: DataTypes.UUID,
		primaryKey: true,
		allowNull: false,
		defaultValue: DataTypes.UUIDV4
	},
	name: {
		type: DataTypes.TEXT,
		allowNull: false
	},
	description: {
		type: DataTypes.TEXT,
	}
}, {
	sequelize: sequelizeConnection,
	modelName: "shops"
});

User.hasOne(Shop, {
	foreignKey: "userId",
	onDelete: "CASCADE",
	onUpdate: "CASCADE"
});

Shop.belongsTo(User);

