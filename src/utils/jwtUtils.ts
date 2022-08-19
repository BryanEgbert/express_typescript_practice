import jwt, { Secret } from "jsonwebtoken";
import { Shop } from "../database/models/shop.model.js";

export async function signToken(id: string): Promise<string> {
	const userShop = await Shop.findOne({
		where: {
			userId: id
		}
	});
	return jwt.sign({
		"id": id,
		"shopId": (userShop !== null) ? userShop.id : null
	}, process.env.TOKEN_SECRET as Secret,
	{ expiresIn: '3000s', audience: "http://localhost:8000", issuer: "http://localhost:8000", notBefore: "0"});
}