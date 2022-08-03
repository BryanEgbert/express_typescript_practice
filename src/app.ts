import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { routes } from "./routes/index.js";
import sequelizeConnection from "./database/config/index.js";
import {User} from "./database/models/user.model.js";

const app = express();
const port: number = 8000;

dotenv.config();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// route
app.use("/", routes);

User.sync({force: true}).then(result => {
	console.log(result);
	app.listen(port, () => {
		console.log(`Application listening at http://localhost:${port}`);
	});

}).catch(err => {
	console.log(err);
});

export const server = app;