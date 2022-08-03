import { Request, Response, NextFunction } from "express";
import { uuid } from "uuidv4";
import { User } from "../database/models/user.model.js";
import { IUser } from "../interfaces/user.interface.js";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { signToken } from "../utils/jwtUtils.js";

const isDev: boolean = process.env.NODE_ENV === "development";

class UserController {
	public async createUser (req: Request, res: Response) {
		const payload = req.body;

		const passwordRegex: RegExp = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
		
		if (passwordRegex.test(payload.password) === false) {
			return res.status(400).json({error: "Weak password"});
		}

		const userInDB = await User.findOne({
			where: {
				username: payload.username,
				email: payload.email
			}
		});

		console.log(`userinDB: ${userInDB}`);
		
		if (userInDB !== null)
			return res.status(409).send({error: "User already exists"});
		
		const newUUID = uuid();
		let newToken = signToken(newUUID);

		let hashedPassword = await hashPassword(payload.password); 
		await User.create({id: newUUID, username: payload.username, email: payload.email, password: hashedPassword});

		return res
			.status(201)
			.cookie("authorization", newToken,
				{ maxAge: 900000, secure: isDev === false, sameSite: 'lax', domain: "http://localhost", httpOnly: true })
			.json({});
	}

	public async getUserByID(req: Request, res: Response) {
		const tokenSecret: string = process.env.TOKEN_SECRET as string;
		const token: string = req.cookies.authorization;

		if (token === null) return res.sendStatus(401);

		jwt.verify(token, tokenSecret, async (err: any, user: any) => {
			if (err) return res.sendStatus(403);
			
			const userInDB = await User.findByPk(user.id);
			if (userInDB === null) return res.status(403).json({error: "invalid token"});		

			return res.status(200).json({username: userInDB.username as string, email: userInDB.email as string});
		})
	}

	public async getUserByEmail(req: Request, res: Response) {
		const payload = req.body;

		const userInDB = await User.findOne({
			where: {
				email: payload.email,
			}
		});

		if (userInDB === null || userInDB === undefined)
		{
			return res.status(404).send({error: "email doesn't exists"});
		}
		
		const passwordMatch: boolean = await comparePassword(payload.password, userInDB.password);

		if (passwordMatch === false) 
			return res.status(401).send({"Error": "Email and password doesn't match"});

		const token = signToken(uuid());

		return res.status(200).cookie("authorization", token,
			{ maxAge: 900000, secure: isDev === false, sameSite: 'lax', domain: "http://localhost", httpOnly: true })
			.json(null);
	}
}

export default UserController;