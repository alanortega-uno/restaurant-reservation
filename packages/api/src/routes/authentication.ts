import { Router } from "express";

import {
  getAllAccounts,
  createAccount,
  login,
  newToken,
  googleAuth,
} from "../handlers/authentication";
import { authorizeToken } from "../middleware/authorization";
import { catchAsyncErrors, catchSyncErrors } from "../utils/catch-error";

const router = Router();

// ToDO: Remove
router.get("/", catchSyncErrors(authorizeToken), getAllAccounts);

router.post("/new-account", catchAsyncErrors(createAccount));
router.post("/login", catchAsyncErrors(login));
router.post("/google", catchAsyncErrors(googleAuth));
router.post("/token", catchAsyncErrors(newToken));

export { router as authRouter };
