import { DataTypes, Model, CreationOptional, InferCreationAttributes, InferAttributes, ForeignKey } from 'sequelize';
import sequelizeConnection from '../config/index.js'
import { Shop } from './shop.model.js';
import { User } from './user.model.js';

export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
	declare id: CreationOptional<number>;
	declare shopId: ForeignKey<string>;
	declare name: string;
	declare price: number;
	declare description: string;
	declare stock: number;
};

Product.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true
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
	},
	stock: {
		type: DataTypes.BIGINT,
		allowNull: false,
		defaultValue: 0,
		set(value: number) {
			if (value < 0)
				this.setDataValue('stock', 0);
			else
				this.setDataValue('stock', value);
		}
	}	
}, {
	sequelize: sequelizeConnection,
	modelName: "products",
});


Shop.hasMany(Product, {
	foreignKey: {field: "productId", allowNull: true},
	onDelete: "CASCADE",
	onUpdate: "CASCADE"
});

Product.belongsTo(Shop);
