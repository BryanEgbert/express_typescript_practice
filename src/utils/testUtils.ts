import { uuid } from "uuidv4";
import { Product } from "../database/models/product.model.js";
import { User } from "../database/models/user.model.js";
import { hashPassword } from "./passwordUtils.js";

export async function mockUserTable(uid: string) {
	const hashedPassword = await hashPassword("Aajjdkdkd12!");
	await User.create({
		id: uid,
		username: "Joe",
		password: hashedPassword,
		email: "joe@test.com"
	});
}

export async function mockProductTable(userUid: string, productNames: string[]) {
	for (let i = 0; i < productNames.length; ++i) {
		await Product.create({
			userId: userUid,
			name: productNames[i],
			description: `${productNames[i]} is awesome`,
			price: 50000
		});
	}
}