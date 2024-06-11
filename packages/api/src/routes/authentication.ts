import { Router } from "express";

import {
  getAllAccounts,
  createAccount,
  login,
  newToken,
} from "../handlers/authentication";
import { authorizeToken } from "../middleware/authorization";

const router = Router();

// ToDO: Remove
router.get("/", authorizeToken, getAllAccounts);

router.post("/", createAccount);
router.post("/login", login);
router.post("/token", newToken);

export { router as authRouter };
