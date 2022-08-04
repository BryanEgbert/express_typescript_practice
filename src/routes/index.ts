import express from "express";
import userRouter from "./users.route.js";
import productRouter from "./product.route.js";

// const use = (fn: (arg0: express.Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, arg1: express.Response<any, Record<string, any>>, arg2: express.NextFunction) => any) => (req: Request, res: Response, next: NextFunction) => 
// 	Promise.resolve(fn(req, res, next)).catch(next);

export const routes = express.Router();

routes.use("/api/users", userRouter);
routes.use("/api/products", productRouter);