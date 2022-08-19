import { Request, Response } from "express";
import { Product } from "../database/models/product.model.js";
import { User } from "../database/models/user.model.js";
import { Cart } from "../database/models/cart.model.js";

class CartController {
	public async addProduct(req: any, res: Response) {
		const uid = req.jwtPayload.id;
		const payload = req.body;

		await Cart.create({
			userId: uid,
			productId: payload.productId,
			amount: payload.amount as number,
			address: payload.address
		}).catch((err) => {
			console.info(err);
			return res.status(500).json({ message: "an error has occured" });
		});

		return res.sendStatus(201); 
	}

	public async getProducts(req: any, res: Response) {
		const uid = req.jwtPayload.id;

		const cartsInDB = await Cart.findAll({
			where: {
				userId: uid,
			},
			include: Product
		});

		if (cartsInDB === null)
			return res.sendStatus(500);

		let productInCarts = [];

		for (let i = 0; i < cartsInDB.length; ++i)
		{
			productInCarts.push({name: cartsInDB[i]?.product?.name});
		}

		return res.status(200).json({cartId: cartsInDB[0].id, products: productInCarts});
	}

	public async updateProduct(req: Request, res: Response) {
		const payload = req.body;

		const cartInDB = await Cart.findOne({
			where: {
				id: req.params.id
			}
		});

		if (cartInDB === null)
			return res.status(404).json({message: "Cart not found"});

		await cartInDB.update({
			address: payload.address,
			amount: payload.amount
		});

		return res.sendStatus(200);
	}

	public async deleteProduct(req: Request, res: Response) {
		const deletedProduct = await Cart.destroy({
			where: {
				productId: req.params.id
			}
		});

		if (deletedProduct === 0)
			return res.sendStatus(100);
		
		return res.sendStatus(200);
	}
}

export default CartController;