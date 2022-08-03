import { server } from "../app.js";
import supertest from "supertest";
import { User } from "../database/models/user.model.js";

const requestWithSuperset = supertest(server);

describe("User Endpoints", () => {
	let userUUID;

	it("[POST] expected: 400 status code because of weak password", async () => {
		const res = await requestWithSuperset.post("/api/users/new")
			.send({username: "Joe", email: "joe@test.com", password: "Joe"});
		expect(res.statusCode).toEqual(400);
	});

	it("[POST] expected: 201 status code and user exist in database", async () => {
		const res = await requestWithSuperset.post("/api/users/new")
			.send({username: "Joe", email: "joe@test.com", password: "Aajjdkdkd12!"});
		expect(res.statusCode).toEqual(201);
		expect(res.type).toEqual("application/json");
		expect(User.findOne({
			where: {
				username: "Joe",
				email: 'joe@test.com'
			}
		})).not.toBeNull();
	});

	// it("[GET] (by id) expected: 200 status code with auth cookie", async () => {
	// 	const res = await requestWithSuperset.get("/api/users/")
	// })
});