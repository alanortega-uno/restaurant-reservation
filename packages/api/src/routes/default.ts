import { Router } from "express";

export const defaultRoute = Router();

// ToDO: Remove:  For tests only
defaultRoute.get("/", (req, res) => {
  res.send("");
});
