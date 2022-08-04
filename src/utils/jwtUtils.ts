import jwt, { Secret } from "jsonwebtoken";

export function signToken(id: string): string {
	return jwt.sign({
		"id": id
	}, process.env.TOKEN_SECRET as Secret,
	{ expiresIn: '3000s', audience: "http://localhost:8000", issuer: "http://localhost:8000" });
}