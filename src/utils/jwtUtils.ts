import { createHash } from "crypto";
import jwt, { Secret } from "jsonwebtoken";
import { TokenClass } from "typescript";
import { RefreshToken } from "../database/models/refreshToken.model.js";
import { Shop } from "../database/models/shop.model.js";

export async function signToken(id: string): Promise<{ token: string, tokenExpiresIn: number, refreshToken: string, refreshTokenExpiresIn: number}> {
	const userShop = await Shop.findOne({
		where: {
			userId: id
		}
	});

	const token = jwt.sign({
		"id": id,
		"shopId": (userShop !== null) ? userShop.id : null
	}, process.env.TOKEN_SECRET as Secret,
	{ expiresIn: '300s', audience: "http://localhost:8000", issuer: "http://localhost:8000", notBefore: "0" });

	const hash = createHash('RSA-MD5');
	const refreshToken = hash.update(id).digest('base64');
	let todayDate: Date = new Date(Date.now());
	let expiryDate = todayDate.setDate(todayDate.getDate() + 1).valueOf();

	await RefreshToken.create({
		userId: id,
		refreshToken: refreshToken,
		expiryDate: expiryDate.toString()
	});
	
	return {token: token, tokenExpiresIn: 300, refreshToken: refreshToken, refreshTokenExpiresIn: 86400};
}