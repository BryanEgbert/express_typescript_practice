import { DataTypes, Model, CreationOptional, InferCreationAttributes, InferAttributes } from 'sequelize';
import sequelizeConnection from '../config/index.js'
import { User } from './user.model.js';

export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
	declare id: CreationOptional<number>;
	declare userId: string;
	declare name: string;
	declare price: number;
	declare description: string;
};

Product.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true
	},
	userId: {
		type: DataTypes.UUID,
		allowNull: false
	},
	name: {
		type: DataTypes.TEXT,
		allowNull: false
	},
	price: {
		type: DataTypes.BIGINT,
		allowNull: false
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: false
	}
}, {
	sequelize: sequelizeConnection,
	modelName: "products"
});

User.hasMany(Product, {
	foreignKey: {allowNull: false}
});

Product.belongsTo(User);

