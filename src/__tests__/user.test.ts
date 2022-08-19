import { server } from "../app.js";
import supertest from "supertest";
import { User } from "../database/models/user.model.js";
import { signToken } from "../utils/jwtUtils.js";
import { uuid } from "uuidv4";
import { hashPassword } from "../utils/passwordUtils.js";
import { mockUserTable } from "../utils/testUtils.js";
import { Server } from "http";
import { Shop } from "../database/models/shop.model.js";

jest.useRealTimers();

describe("User Endpoints", () => {
	let app: Server;
	beforeAll(async () => {
		app = server.listen(8080);
		await User.sync({force: true});
		await Shop.sync({force: true});
	});

	it("[POST] expected: 201 status code", async () => {
		const res = await supertest(server).post("/api/users/new")
		.set("Accept", "*/*")
		.send({username: "Joe", email: "joe@test.com", password: "Aajjdkdkd12!"})
		.expect(201);
		
		expect(await User.findOne({where: {
			username: "Joe",
			email: "joe@test.com"
		}})).not.toBeNull();
	});

	it("[POST] expected: 400 status code because of weak password", async () => {
		const res = await supertest(server).post("/api/users/new")
			.set("Accept", "*/*")
			.send({username: "Joe", email: "joe@test.com", password: "Joe"});

		expect(res.statusCode).toEqual(400);
	
	});

	it("[GET] (by email) expected: 200 status code", async () => {
		await mockUserTable(uuid(), uuid());
		const res = await supertest(server).get("/api/users/login")
			.send({ "email": "joe@test.com", "password": "Aajjdkdkd12!"});

		expect(res.statusCode).toEqual(200);
		expect(res.headers["set-cookie"]).not.toBeNull();
	})

	it("[GET] (by id) expected: 200 status code with auth cookie", async () => {
		const newUUID = uuid();
		await mockUserTable(newUUID, uuid());

		var res = await supertest(server)
			.get("/api/users/")
			.set("Cookie", `authorization=${await signToken(newUUID)}`)
			.send(undefined);
		expect(res.statusCode).toEqual(200);
		expect(res.body.username).toEqual("Joe");
		expect(res.body.email).toEqual("joe@test.com");
	});

	afterAll(() => {
		app.close();
	})
});