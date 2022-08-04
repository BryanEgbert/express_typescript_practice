import { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ITokenResponse, IUserRequest } from "../types/request.types.js";
import { User } from "../database/models/user.model.js";

dotenv.config();

export function jwtAuthorization(req: any, res: Response, next: NextFunction) {
	if (req.cookies.authorization === null)
		return res.status(401).json({ message: "unauthorized" });

	jwt.verify(req.cookies.authorization, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
		if (err) {
			return res.status(403).json({message: "unauthorized"});
		}
		req.user = user;
		next();
	});
}