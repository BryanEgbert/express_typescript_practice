import { DataTypes, Model, CreationOptional, InferCreationAttributes, InferAttributes, ForeignKey, HasManyGetAssociationsMixin, NonAttribute, Association } from 'sequelize';
import sequelizeConnection from '../config/index.js'
import { User } from './user.model.js';
import { Product } from './product.model.js';

export class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart>> {
	declare id: CreationOptional<string>;
	declare userId: ForeignKey<string>;
	declare productId: ForeignKey<number>;
	declare amount: number;
	declare address: string;

	declare getProducts: HasManyGetAssociationsMixin<Product>;
	declare products?: NonAttribute<Product[]>;
	declare product?: NonAttribute<Product>;

	getProduct(productID: number): NonAttribute<Product> {
		return this.products?.find(p => p.id === productID) as Product;
	}
};

Cart.init({
	id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4
	},
	amount: {
		type: DataTypes.INTEGER,
		defaultValue: 1
	},
	address: {
		type: DataTypes.TEXT,
		allowNull: false
	}
}, {
	sequelize: sequelizeConnection,
	modelName: "carts"
});

User.hasOne(Cart, {
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
	foreignKey: { allowNull: false }
});

Product.hasMany(Cart, {
	onUpdate: "CASCADE",
	onDelete: "CASCADE",
	foreignKey: { allowNull: false },
});

Cart.belongsTo(User);

Cart.belongsTo(Product);