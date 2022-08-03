import express from "express";
import userRouter from "./users.route.js";

export const routes = express.Router();

routes.use("/api/users", userRouter);