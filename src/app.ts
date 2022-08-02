import express from "express";
import cookieParser from "cookie-parser";
import { routes } from "./routes/index.js";
import { User } from "./database/models/user.model.js";
import sequelizeConnection from "./database/config/config.js";
import pg from "pg";

const app = express();

const port: number = 8000;

app.use(express.json());
app.use(cookieParser());

app.use("/", routes);

sequelizeConnection.sync({alter: true});

app.listen(port, ()=> {
	console.log(`Application listening at http://localhost:${port}`);
});

export const server = app;