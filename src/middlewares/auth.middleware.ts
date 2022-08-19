import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ITokenResponse, IUserRequest } from "../types/request.types.js";
import { User } from "../database/models/user.model.js";
import { signToken } from "../utils/jwtUtils.js";

dotenv.config();

export function jwtAuthorization(req: any, res: Response, next: NextFunction) {
	if (req.cookies.authorization === null || req.cookies === null || req.cookies === undefined)
		return res.status(401).json({ message: "unauthorized" });

	jwt.verify(req.cookies.authorization, process.env.TOKEN_SECRET as string, 
		{
			audience: "http://localhost:8000", 
			issuer: "http://localhost:8000", 
			algorithms: ["HS256"], 
			ignoreExpiration: false, 
			ignoreNotBefore: false
		}, (err: any, jwtPayload: any) => {
		// if (err.name === "TokenExpiredError") {
		// 	return res.status(401).json({ message: "Token expired" });
		// } else {
		// 	return res.status(401).json({message: "Invalid token"});
		// }
		if (err)
			return res.status(401).json({ message: "Invalid token" });
		req.jwtPayload = jwtPayload;
		next();
	});
}

/**
 * 
 * @description Use this middleware after jwtAuthorization middleware
 */
export function shopAuthorization(req: any, res: Response, next: NextFunction) {
	if (req.jwtPayload.shopId === null || req.jwtPayload.shopId === undefined) {
		return res.status(403).json({message: "User didn't open a shop"});
	}

	next();
}