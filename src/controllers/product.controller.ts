import { Request, Response } from "express";
import { Op } from "sequelize";
import { Product } from "../database/models/product.model.js";

class ProductController {
	public async createProduct(req: any, res: Response) {
		const shopId = req.jwtPayload.shopId;

		const payload = req.body;

		await Product.create({
			shopId: shopId,
			name: payload.name,
			price: payload.price,
			description: payload.description,
			stock: payload.stock
		}).catch((err) => {
			console.info(err);
			return res.status(500).json({message: "An error has occured"});
		});
		
		return res.sendStatus(201);

	}

	public async getProductsByUserID(req: any, res: Response) {
		const shopId = req.jwtPayload.shopId;
		
		const productsInDB: Product[] = await Product.findAll({
			where: {
				shopId: shopId
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
			.json({
				name: productInDB.name, 
				description: productInDB.description, 
				price: productInDB.price, 
				stock: productInDB.stock
			});
	}

	public async getAllProducts(req: Request, res: Response) {
		const productsInDB: Product[] = await Product.findAll();
		let data: { name: string; description: string; price: number; stock: number; }[] = [];
		productsInDB.forEach((product) => {
			data.push({
				name: product.name,
				description: product.description,
				price: product.price,
				stock: product.stock
			})
		});

		return res.status(200).json({products: data});
	}

	public async updateProduct(req: any, res: Response) {
		const payload = req.body;
		const productInDB: Product | null = await Product.findOne({
			where: {
				[Op.and]: [{
					id: req.params.id
				}, {
					shopId: req.jwtPayload.shopId
				}]
			}
		});

		if (productInDB === null) 
			return res.status(404).json({message: `product with id of ${req.params.id} doesn't exist`});

		if (productInDB.shopId !== req.jwtPayload.shopId)
			return res.status(401).json({message: "unauthorized"});

		productInDB.update({
			name: payload.name,
			description: payload.description,
			price: payload.price,
			stock: payload.stock,
		});

		return res.sendStatus(200);
	}

	public async deleteProduct(req: any, res: Response) {
		const shopId = req.jwtPayload.shopId;
		await Product.destroy({
			where: {
				id: parseInt(req.params.id),
				shopId: shopId
			}
		}).catch((err) => {
			return res.status(500).json({ message: err });
		});

		res.sendStatus(200);
	}
}

export default ProductController;