import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
	const salt: string = await bcrypt.genSalt(10);
	const hash: string = await bcrypt.hash(password, salt);

	return hash;
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
	const isPasswordValid: boolean = await bcrypt.compare(password, hashedPassword);

	return isPasswordValid;
}