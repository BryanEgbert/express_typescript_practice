import { server } from "../app.js";
import supertest from "supertest";
import { User } from "../database/models/user.model.js";
import { signToken } from "../utils/jwtUtils.js";
import { uuid } from "uuidv4";
import { hashPassword } from "../utils/passwordUtils.js";
import { Product } from "../database/models/product.model.js";
import { mockProductTable, mockUserTable } from "../utils/testUtils.js";
import { Server } from "http";

const requestWithSuperset = supertest(server);

jest.useRealTimers();

describe("Product Endpoints", () => {
	let userUUID: string = uuid();
	let token: string = signToken(userUUID);
	let app: Server;
	const productNames: string[] = ["Grape", "Pears", "Citrus", "Orange", "Strawberry"];

	beforeAll(async () => {
		app = server.listen(9000);
		await User.sync({force: true});
		await Product.sync({force: true});

		await mockUserTable(userUUID);
		await mockProductTable(userUUID, productNames);
	});

	it("[GET] (user id's products) expected: 200 status code", async () => {
		expect(await Product.findAll()).toHaveLength(productNames.length);

		const res = await requestWithSuperset.get("/api/products/")
			.set("Accept", "*/*")
			.set("Cookie", `authorization=${token}`)
			.send(undefined)
			.expect(200);

		expect(res.body.products).toHaveLength(productNames.length);
	});

	it("[GET] (one product) expected: 200 status code", async () => {
		// await mockUserTable(userUUID);
		// await mockProductTable(userUUID, productNames);

		expect(await Product.findAll()).toHaveLength(productNames.length);

		const res = await requestWithSuperset.get("/api/products/4")
			.set("Accept", "*/*")
			.set("Cookie", `authorization=${token}`)
			.send(undefined)
			.expect(200);

		expect(parseInt(res.body.price)).toEqual(50000);
		expect(res.body.name).toEqual("Orange");
		expect(res.body.description).toEqual("Orange is awesome");
	});

	it("[GET] (all products) expected: 200 status code", async () => {
		// await mockUserTable(userUUID);
		// await mockProductTable(userUUID, productNames);

		const res = await requestWithSuperset.get("/api/products/all")
			.set("Accept", "*/*")
			.send(undefined)
			.expect(200);

		expect(res.body).not.toBeNull();
	});

	it("[POST] (insert new product) expected 201 status code", async () => {
		expect(await User.findAll()).toHaveLength(1);
		expect(await Product.findAll()).toHaveLength(productNames.length);
		
		const res = await requestWithSuperset.post("/api/products/")
			.set("Accept", "*/*")
			.set("Cookie", `authorization=${token}`)
			.send({name: "Apple", description: "Best apple in the world", price: 100000})
			.expect(201);

		expect(await Product.findOne({
			where: {
				name: "Apple",
				description: "Best apple in the world",
				price: 100000
			}
		})).not.toBeNull();
	});

	it("[DELETE] expected: 200 status code", async () => {
		expect(await Product.findAll()).toHaveLength(productNames.length + 1);

		const res = await requestWithSuperset.delete("/api/products/5")
			.set("Cookie", `authorization=${token}`)
			.send(undefined)
			.expect(200);
	});

	afterAll(() => {
		app.close();
	})
})