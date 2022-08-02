import { server } from "../app.js"
import supertest from "supertest";

const requestWithSuperset = supertest(server);

describe("User Endpoints", () => {
	it("[POST] expected: 400 status code because of weak password", async () => {
		const res = await requestWithSuperset.post("/api/users/new")
			.send({username: "Joe", email: "joe@test.com", password: "Joe"});
		expect(res.statusCode).toEqual(400);
	});

	it("[POST] expected: 201 status code with auth cookie", async () => {
		const res = await requestWithSuperset.post("/api/users/new")
			.send({username: "Joe", email: "joe@test.com", password: "Aajjdkdkd12!"});
		expect(res.statusCode).toEqual(201);
	})
});