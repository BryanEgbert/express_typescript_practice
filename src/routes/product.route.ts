import express, { Request, Response, Router } from "express";
import ProductController from "../controllers/product.controller.js";
import { jwtAuthorization, shopAuthorization } from "../middlewares/auth.middleware.js";

const productRouter = express.Router();
const productController = new ProductController();

// productRouter.use(jwtAuthorization);

productRouter.get("/", jwtAuthorization, shopAuthorization, async (req: Request, res: Response) => {
	await productController.getProductsByUserID(req, res);
});

productRouter.get("/:id(\\d+)", async (req: Request, res: Response) => {
	await productController.getProductByID(req, res);
});

productRouter.get("/all", async (req: Request, res: Response) => {
	await productController.getAllProducts(req, res);
});

productRouter.post("/", jwtAuthorization, shopAuthorization, async (req: Request, res: Response) => {
	await productController.createProduct(req, res);
});

productRouter.put("/:id(\\d+)", jwtAuthorization, shopAuthorization, async (req: Request, res: Response) => {
	await productController.updateProduct(req, res);
})

productRouter.delete("/:id(\\d+)", jwtAuthorization, async (req: Request, res: Response) => {
	await productController.deleteProduct(req, res);
});

export default productRouter;