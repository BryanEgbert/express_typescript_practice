import { server } from "../app.js";
import supertest from "supertest";
import { User } from "../database/models/user.model.js";
import { signToken } from "../utils/jwtUtils.js";
import { uuid } from "uuidv4";
import { hashPassword } from "../utils/passwordUtils.js";
import { Product } from "../database/models/product.model.js";
import { mockCartTable, mockProductTable, mockShopTable, mockUserTable } from "../utils/testUtils.js";
import { Server } from "http";
import { Cart } from "../database/models/cart.model.js";

jest.useRealTimers();

describe("Cart endpoint", () => {
	let userUUID: string = uuid();
	let userUUID2: string = uuid();

	let shopId = uuid();

	let token = signToken(userUUID);
	let token2 = signToken(userUUID2);

	let cartID: string;
	let app: Server;
	const productNames: string[] = ["Grape", "Pears", "Citrus", "Orange", "Strawberry"];

	beforeAll(async () => {
		app = server.listen(8000);

		await User.sync({force: true});
		await Product.sync({force: true});
		await Cart.sync({force: true});

		try {
			await mockUserTable(userUUID, userUUID2);
			await mockShopTable(shopId, userUUID);
			await mockProductTable(shopId, productNames);
			await mockCartTable(userUUID2, productNames.length);
		} catch(err) {
			console.info(err);
		}
	});

	it("[GET] (all products in cart) expected: 200 status code", async () => {
		try {
			expect(await Cart.findAll()).toHaveLength(productNames.length);
			const res = await supertest(server).get("/api/carts/")
				.set("Accept", "*/*")
				.set("Cookie", `authorization=${await token2}`)
				.send(undefined)
				.expect(200);
			
			expect(res.body.products).toHaveLength(productNames.length);
		} catch(err) {
			console.info(err);
		}
	});

	it("[POST] (add product to cart) expected: 201 status code", async () => {
		let product = await Product.findOne({where: {name: "Grape"}});
		const res = await supertest(server).post("/api/carts/")
			.set("Accept", "*/*")
			.set("Cookie", `authorization=${await token2}`)
			.send({userId: userUUID2, productId: product?.id, address: "jelambar", amount: 1})
			.expect(201);

		let cart = await Cart.findOne({ where: { userId: userUUID2 } });

		expect(cart).not.toBeNull();
		expect(cart?.userId).toEqual(userUUID2);
		expect(cart?.productId).toEqual(product?.id);
		expect(cart?.amount).toEqual(1);
		expect(cart?.address).toEqual("jelambar");

		cartID = cart?.id as string;
	});

	it("[PUT] (update address and amount) expected: 200 status code", async () => {
		let cart = await Cart.findOne({where: {id: cartID}});
		expect(cart).not.toBeNull();

		const res = await supertest(server).put(`/api/carts/${cart?.id}`)
			.set("Accept", "*/*")
			.set("Cookie", `authorization=${await token2}`)
			.send({address: "Tangerang", amount: 5})
			.expect(200);

		cart = await Cart.findOne({ where: { id: cartID } });
		expect(cart?.address).toEqual("Tangerang");
		expect(cart?.amount).toEqual(5);
	});

	it("[DELETE] (delete product in cart) expected: 200 status code", async () => {
		let cart = await Cart.findOne({ where: { userId: userUUID2 } });
		expect(cart).not.toBeNull();

		const res = await supertest(server).delete(`/api/carts/${cart?.productId}`)
			.set("Accept", "*/*")
			.set("Cookie", `authorization=${await token2}`)
			.send(undefined)
			.expect(200);

		expect(await Cart.findAll()).toHaveLength(productNames.length);
	});

	afterAll(() => {
		app.close();
	});
})