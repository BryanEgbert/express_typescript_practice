import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { routes } from "./routes/index.js";
import sequelizeConnection from "./database/config/index.js";
import {User} from "./database/models/user.model.js";

const app = express();

const port: number = 8000;

dotenv.config();

User.sync().then(result => {
	console.log(result);
	app.listen(port, () => {
		console.log(`Application listening at http://localhost:${port}`);
	});

}).catch(err => {
	console.log(err);
});

app.use(express.json());
app.use(cookieParser());

app.use("/", routes);

// const serverClient = new pg.Client ({
// 	user: process.env.DB_USER,
// 	password: process.env.DB_PASSWORD,
// 	host: process.env.DB_HOST,
// 	database: process.env.DB_DRIVER
// });

// serverClient.connect();
// serverClient.query('CREATE DATABASE "TSexpress_practice"', (err, res) => {
// 	serverClient.end();
// })

// sequelizeConnection.authenticate();
export const server = app;