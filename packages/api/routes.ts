import express from "express";
import { authRouter } from "./src/routes/authentication";
import { defaultRoute } from "./src/routes/default";

export const routes = express.Router();

routes.use(defaultRoute);
routes.use("/auth", authRouter);
