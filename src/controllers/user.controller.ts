import { Request, Response, NextFunction } from "express";
import { uuid } from "uuidv4";
import { User } from "../database/models/user.model.js";
import { IUser } from "../interfaces/user.interface.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { hashPassword } from "../utils/passwordUtils.js";

class UserController {
	public createUser = async (req: Request, res: Response, next: NextFunction) => {
		const payload: IUser = req.body;

		const password = payload.password;
		const passwordRegex: RegExp = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
		const newUUID = uuid();

		if (passwordRegex.test(password)) {
			let token = jwt.sign({
				"id": newUUID
			},
			process.env.TOKEN_SECRET as string,
			{ expiresIn: '3000s', audience: "http://localhost:8000", issuer: "http://localhost:8000" });

			let hashedPassword = await hashPassword(password); 
			await User.create({id: newUUID, username: payload.username, email: payload.password, password: hashedPassword});

			return res.status(201)
				.json({ "token": token })
				.cookie("Authorization", token, 
					{ maxAge: 900000, secure: true, sameSite: 'lax', domain: "http://localhost", httpOnly: true });
		} else {
			return res.status(400).send({ "error": "Weak Password" });
		}
	}
}