import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { routes } from "./routes/index.js";
import sequelizeConnection from "./database/config/index.js";
import {User} from "./database/models/user.model.js";
import { Product } from "./database/models/product.model.js";
import { Cart } from "./database/models/cart.model.js";
import { Shop } from "./database/models/shop.model.js";
import { RefreshToken } from "./database/models/refreshToken.model.js";

const app = express();
const port: number = 8000;

dotenv.config();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// route
app.use("/", routes);

if (process.env.NODE_ENV !== "test")
{
	User.sync({force: true}).then(result => {
		console.info(result);
		Product.sync({force: true}).then(result => {
			console.error(result);
		});
		Cart.sync({force: true}).catch(err => {
			console.error(err);
		});
		Shop.sync({force: true}).catch(err => {
			console.error(err);
		});
		RefreshToken.sync({force: true}).catch(err => {
			console.error(err);
		});
	}).catch(err => {
		console.debug(err);
	});
	app.listen(port, () => {
		console.debug(`Application listening at http://localhost:${port}`);
	});
}

export const server = app;