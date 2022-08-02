import express from "express";
import userRouter from "./users.js";

export const routes = express.Router();

routes.use("/api/users", userRouter);