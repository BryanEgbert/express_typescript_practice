// /api/users

import express, {Request, Response, Router} from "express";
import { ITokenResponse, IUserRequest } from "../types/request.types.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { uuid } from "uuidv4";
import { hashPassword } from "../utils/passwordUtils.js";
import { User } from "../database/models/user.model.js";
import UserController from "../controllers/user.controller.js";
import { RefreshToken } from "../database/models/refreshToken.model.js";
import { signToken } from "../utils/jwtUtils.js";
import { jwtAuthorization } from "../middlewares/auth.middleware.js";

const userRouter: Router = express.Router();

dotenv.config();

const isProd: boolean = process.env.NODE_ENV === "production";

const userController = new UserController();

userRouter.post("/new", async (req: Request<{}, ITokenResponse, IUserRequest>, res: Response) => {
	await userController.createUser(req, res).catch(err => console.error(err));
});

userRouter.get("/login", async (req: Request, res: Response) => {
	await userController.loginByEmail(req, res);
});

userRouter.get("/", jwtAuthorization, async (req: Request, res: Response) => {
	await userController.getUserByID(req, res);
});

userRouter.get("/refresh", async (req: Request, res: Response) => {
	const userRefreshToken = await RefreshToken.findOne({where: {refreshToken: req.cookies.refreshToken}});
	if (userRefreshToken === null) {
		return res.status(401).json({ message: "Refresh token is not valid" });
	}

	let newToken = await signToken(req.body.id);

	return res
		.status(201)
		.cookie("authorization", newToken.token,
			{ maxAge: 900000, secure: isProd, sameSite: 'lax', domain: "http://localhost", httpOnly: true })
		.end();
});

export default userRouter;