import { server } from "../app.js";
import supertest from "supertest";
import { User } from "../database/models/user.model.js";
import { signToken } from "../utils/jwtUtils.js";
import { uuid } from "uuidv4";
import { hashPassword } from "../utils/passwordUtils.js";

const requestWithSuperset = supertest(server);

jest.useRealTimers();

describe("User Endpoints", () => {
	beforeAll(async () => {
		await User.sync({force: true});
	});

	it("[POST] expected: 201 status code", async () => {
		const res = await requestWithSuperset.post("/api/users/new")
		.set("Accept", "*/*")
		.send({username: "Joe", email: "joe@test.com", password: "Aajjdkdkd12!"});
		
		expect(res.statusCode).toEqual(201);
	});

	it("[POST] expected: 400 status code because of weak password", async () => {
		const res = await requestWithSuperset.post("/api/users/new")
			.set("Accept", "*/*")
			.send({username: "Joe", email: "joe@test.com", password: "Joe"});

		expect(res.statusCode).toEqual(400);
	
	});

	it("[GET] (by email) expected: 200 status code", async () => {
		const hashedPassword = await hashPassword("Aajjdkdkd12!");
		User.create({
			id: uuid(),
			username: "Joe",
			password: hashedPassword,
			email: "joe@test.com"
		});
		const res = await requestWithSuperset.get("/api/users/login")
			.send({ "email": "joe@test.com", "password": "Aajjdkdkd12!"});

		expect(res.statusCode).toEqual(200);
		expect(res.headers["set-cookie"]).not.toBeNull();
	})

	it("[GET] (by id) expected: 200 status code with auth cookie", async () => {
		const newUUID = uuid();
		User.create({
			id: newUUID,
			username: "Joe",
			password: "joe",
			email: "joe@test.com"
		});

		var res = await requestWithSuperset
			.get("/api/users/")
			.set("Cookie", `authorization=${signToken(newUUID)}`)
			.send(undefined);
		expect(res.statusCode).toEqual(200);
		expect(res.body.username).toEqual("Joe");
		expect(res.body.email).toEqual("joe@test.com");
	})
});