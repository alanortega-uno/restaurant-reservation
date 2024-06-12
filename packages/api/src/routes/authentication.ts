import { Router } from "express";

import {
  getAllAccounts,
  createAccount,
  login,
  newToken,
  googleAuth,
} from "../handlers/authentication";
import { authorizeToken } from "../middleware/authorization";

const router = Router();

// ToDO: Remove
router.get("/", authorizeToken, getAllAccounts);

router.post("/new-account", createAccount);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/token", newToken);

export { router as authRouter };
