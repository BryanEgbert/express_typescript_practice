import { server } from "../app.js";
import supertest from "supertest";
import { Sequelize } from "sequelize";
import { User } from "../database/models/user.model.js";
import { signToken } from "../utils/jwtUtils.js";
import { uuid } from "uuidv4";
import { hashPassword } from "../utils/passwordUtils.js";
import { Product } from "../database/models/product.model.js";
import { mockProductTable, mockShopTable, mockUserTable } from "../utils/testUtils.js";
import { Server } from "http";

jest.useRealTimers();

describe("Product Endpoints", () => {
	let userUUID: string = uuid();
	let userUUID2: string = uuid();
	let token: Promise<{token: string, refreshToken: string}>;
	let shopId: string = uuid();

	let app: Server;
	const productNames: string[] = ["Grape", "Pears", "Citrus", "Orange", "Strawberry"];

	beforeAll(async () => {
		app = server.listen(9000);
		
		await User.sync({force: true});
		await Product.sync({force: true});

		await mockUserTable(userUUID, userUUID2);
		await mockShopTable(shopId, userUUID);
		await mockProductTable(shopId, productNames);

		token = signToken(userUUID);
	});

	it("[GET] (user id's products) expected: 200 status code", async () => {
		expect(await Product.findAll()).toHaveLength(productNames.length);

		const res = await supertest(server).get("/api/products/")
			.set("Accept", "*/*")
			.set("Cookie", `authorization=${(await token).token}`)
			.send(undefined)
			.expect(200);

		expect(res.body.products).toHaveLength(productNames.length);
	});

	it("[GET] (one product) expected: 200 status code", async () => {
		expect(await Product.findAll()).toHaveLength(productNames.length);

		const res = await supertest(server).get("/api/products/4")
			.set("Accept", "*/*")
			.set("Cookie", `authorization=${(await token).token}`)
			.send(undefined)
			.expect(200);

		expect(parseInt(res.body.price)).toEqual(50000);
		expect(res.body.name).toEqual("Orange");
		expect(res.body.description).toEqual("Orange is awesome");
		expect(parseInt(res.body.stock)).toEqual(4);
	});

	it("[GET] (all products) expected: 200 status code", async () => {
		const res = await supertest(server).get("/api/products/all")
			.set("Accept", "*/*")
			.send(undefined)
			.expect(200);

		expect(res.body).not.toBeNull();
		expect(res.body.products).toHaveLength(productNames.length);
	});

	it("[POST] (insert new product) expected 201 status code", async () => {
		expect(await Product.findAll()).toHaveLength(productNames.length);
		
		const res = await supertest(server).post("/api/products/")
			.set("Accept", "*/*")
			.set("Cookie", `authorization=${(await token).token}`)
			.send({name: "Apple", description: "Best apple in the world", price: 100000, stock: 6})
			.expect(201);

		expect(await Product.findOne({
			where: {
				name: "Apple",
				description: "Best apple in the world",
				price: 100000,
				stock: 6
			}
		})).not.toBeNull();
	});

	it("[PUT] (update product) expected 200 status code", async () => {
		expect(await Product.findAll()).toHaveLength(productNames.length + 1);

		const res = await supertest(server).put("/api/products/6")
			.set("Accept", "*/*")
			.set("Cookie", `authorization=${(await token).token}`)
			.send({name: "Melon", description: "Melon is the best fruit", price: 50000, stock: 300})
			.expect(200);

		expect(await Product.findOne({
			where: { name: "Melon", description: "Melon is the best fruit", price: 50000, stock: 300 }
		})).not.toBeNull();
	});

	it("[DELETE] expected: 200 status code", async () => {
		expect(await Product.findAll()).toHaveLength(productNames.length + 1);

		const res = await supertest(server).delete("/api/products/5")
			.set("Cookie", `authorization=${(await token).token}`)
			.send(undefined)
			.expect(200);
	});

	afterAll(() => {
		app.close();
	})
})