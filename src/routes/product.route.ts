import express, { Request, Response, Router } from "express";
import ProductController from "../controllers/product.controller.js";
import { jwtAuthorization } from "../middlewares/auth.middleware.js";

const productRouter = express.Router();
const productController = new ProductController();

// productRouter.use(jwtAuthorization);

productRouter.get("/", jwtAuthorization, async (req: Request, res: Response) => {
	// TODO: fetch product based on user id in jwt
	await productController.getProductsByUserID(req, res);
});

productRouter.get("/:id(\\d+)", async (req: Request, res: Response) => {
	// TODO: fetch product based on product id
	await productController.getProductByID(req, res);
});

productRouter.get("/all", async (req: Request, res: Response) => {
	// TODO: fetch all products
	await productController.getAllProducts(req, res);
});

productRouter.post("/", jwtAuthorization, async (req: Request, res: Response) => {
	// TODO: create product
	await productController.createProduct(req, res);
});

productRouter.delete("/:id(\\d+)", jwtAuthorization, async (req: Request, res: Response) => {
	// TODO: delete product based on id. User id must be the same
	await productController.deleteProduct(req, res);
});

export default productRouter;