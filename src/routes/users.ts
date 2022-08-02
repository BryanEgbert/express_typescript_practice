// /api/users

import express, {Request, Response, Router} from "express";
import { ITokenResponse, IUserRequest } from "../types/request.types.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const userRouter: Router = express.Router();

dotenv.config();

userRouter.post("/new", (req: Request<{}, ITokenResponse, IUserRequest>, res: Response) => {
	const password = req.body.password;
	const passwordRegex: RegExp = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;

	if (passwordRegex.test(password)) {
		let token = jwt.sign({
			"username": req.body.username,
			"email": req.body.email
		}, 
		process.env.TOKEN_SECRET as string, 
		{ expiresIn: '3000s', audience: "http://localhost:8000", issuer: "http://localhost:8000" });

		return res.status(201).json({"token": token}).cookie("Authorization", token, {maxAge: 900000, secure: true, sameSite: 'lax', domain: "http://localhost"});
	} else {
		return res.status(400).send({"error": "Weak Password"});
	}
});

userRouter.get("/:userId")

export default userRouter;