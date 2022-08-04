export interface IUser {
	id: any;
	username: string;
	email: string;
	password: string;
	isSeller: boolean;
};

export interface IToken {
	token: string;
};