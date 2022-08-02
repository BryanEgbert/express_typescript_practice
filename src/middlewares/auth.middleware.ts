import { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { ITokenResponse, IUserRequest } from "../types/request.types.js";


function verifyJWT(req: Request, res: Response, next: NextFunction) {
	console.log("cookies: " + req.cookies);
	console.log("Signed cookies: " + req.signedCookies);
	next();
}