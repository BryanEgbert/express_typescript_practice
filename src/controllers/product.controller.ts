import { Request, Response, NextFunction } from "express";
import { uuid } from "uuidv4";
import { User } from "../database/models/user.model.js";
import { IUser } from "../interfaces/user.interface.js";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { signToken } from "../utils/jwtUtils.js";
import { Product } from "../database/models/product.model.js";

const isProd: boolean = process.env.NODE_ENV === "production";

class ProductController {
	public async createProduct(req: any, res: Response) {
		const uid = req.user.id;

		const payload = req.body;

		await Product.create({
			userId: uid,
			name: payload.name,
			price: payload.price,
			description: payload.description
		}).catch((err) => {
			console.info(err);
			return res.status(500).json({message: err});
		});
		
		return res.sendStatus(201);

	}

	public async getProductsByUserID(req: any, res: Response) {
		const uid = req.user.id;
		
		const productsInDB: Product[] = await Product.findAll({
			where: {
				userId: uid
			}
		});

		return res.status(200).json({products: productsInDB});
	}

	public async getProductByID(req: Request, res: Response) {
		const idParam = parseInt(req.params.id);
		if (idParam === null || idParam === undefined)
			return res.status(400).json({message: "bad request"});

		const productInDB: Product | null = await Product.findByPk(idParam);

		if (productInDB === null)
			return res.status(404).json({message: `Product with id of ${idParam} not found`})

		return res
			.status(200)
			.json({name: productInDB.name, description: productInDB.description, price: productInDB.price});
	}

	public async getAllProducts(req: Request, res: Response) {
		const productsInDB: Product[] = await Product.findAll();
		let data: { name: string; description: string; price: number; }[] = [];
		productsInDB.forEach((product) => {
			data.push({
				name: product.name,
				description: product.description,
				price: product.price
			})
		});

		return res.status(200).json({products: data});
	}

	public async deleteProduct(req: any, res: Response) {
		const uid = req.user.id;
		await Product.destroy({
			where: {
				id: parseInt(req.params.id),
				userId: uid
			}
		}).catch((err) => {
			return res.status(500).json({ message: err });
		});

		res.sendStatus(200);
	}
}

export default ProductController;