import express from "express";
import userRouter from "./users.route.js";
import productRouter from "./product.route.js";
import cartRouter from "./cart.route.js";

export const routes = express.Router();

routes.use("/api/users", userRouter);
routes.use("/api/products", productRouter);
routes.use("/api/carts", cartRouter);