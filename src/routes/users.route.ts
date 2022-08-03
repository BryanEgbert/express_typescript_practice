// /api/users

import express, {Request, Response, Router} from "express";
import { ITokenResponse, IUserRequest } from "../types/request.types.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { uuid } from "uuidv4";
import { hashPassword } from "../utils/passwordUtils.js";
import { User } from "../database/models/user.model.js";
import UserController from "../controllers/user.controller.js";

const userRouter: Router = express.Router();

dotenv.config();

const userController = new UserController();

userRouter.post("/new", async (req: Request<{}, ITokenResponse, IUserRequest>, res: Response) => {
	await userController.createUser(req, res);
});

userRouter.get("/login", async (req: Request, res: Response) => {
	await userController.getUserByEmail(req, res);
})
userRouter.get("/", async (req: Request, res: Response) => {
	await userController.getUserByID(req, res);
})

export default userRouter;