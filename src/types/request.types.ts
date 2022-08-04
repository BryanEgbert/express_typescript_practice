import {Request} from "express";

export interface IUserRequest {
	username: string;
	email: string;
	password: string;
};

export interface ITokenResponse {
	token: string;
};