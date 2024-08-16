import { Router } from "express";

import { catchAsyncErrors } from "../utils/catch-error";
import { resetDB } from "../handlers/e2e";

const router = Router();

router.get("/reset-db", catchAsyncErrors(resetDB));

export { router as e2eRouter };
