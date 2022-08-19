import express, { Request, Response, Router } from "express";
import CartController from "../controllers/cart.controller.js";
import { jwtAuthorization } from "../middlewares/auth.middleware.js";

const cartRouter: Router = express.Router();

const cartController = new CartController();

cartRouter.use(jwtAuthorization);

cartRouter.get("/", async (req: Request, res: Response) => {
	await cartController.getProducts(req, res);
});

cartRouter.post("/", async (req: Request, res: Response) => {
	await cartController.addProduct(req, res);
});

cartRouter.put("/:id", async (req: Request, res: Response) => {
	await cartController.updateProduct(req, res);
});

cartRouter.delete("/:id(\\d+)", async (req: Request, res: Response) => {
	await cartController.deleteProduct(req, res);
})

export default cartRouter;

