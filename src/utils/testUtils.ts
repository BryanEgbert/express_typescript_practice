import { Cart } from "../database/models/cart.model.js";
import { Product } from "../database/models/product.model.js";
import { Shop } from "../database/models/shop.model.js";
import { User } from "../database/models/user.model.js";
import { hashPassword } from "./passwordUtils.js";

export async function mockUserTable(uid: string, anotherId: string) {
	const hashedPassword = await hashPassword("Aajjdkdkd12!");
	await User.create({
		id: uid,
		username: "Joe",
		password: hashedPassword,
		email: "joe@test.com"
	});

	await User.create({
		id: anotherId,
		username: "Bob",
		password: hashedPassword,
		email: "bob@test.com"
	});
}

export async function mockShopTable(shopId: string, uid: string) {
	await Shop.create({
		id: shopId,
		userId: uid,
		name: "Shop 1",
		description: "shop 1 desc",
	});
}

export async function mockProductTable(shopId: string, productNames: string[]) {
	for (let i = 0; i < productNames.length; ++i) {
		await Product.create({
			shopId: shopId,
			name: productNames[i],
			description: `${productNames[i]} is awesome`,
			price: 50000,
			stock: i + 1
		});
	}
}

export async function mockCartTable(userUid: string, productLenght: number) {
	for (let i = 0 ; i < productLenght; ++i)
	{
		await Cart.create({
			userId: userUid,
			productId: i + 1,
			amount: 1,
			address: "jelambar"
		});
	}
}