import express from "express";

interface IRoute {
	path: string;
	router: express.Router;
};

export default IRoute;