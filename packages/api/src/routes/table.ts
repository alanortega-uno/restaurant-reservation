import { Router } from "express";

import { getAllTables } from "../handlers/table";

import { authorizeToken } from "../middleware/authorization";
import { catchAsyncErrors, catchSyncErrors } from "../utils/catch-error";

const router = Router();

router.get(
  "/",
  catchSyncErrors(authorizeToken),
  catchAsyncErrors(getAllTables)
);

export { router as tablesRouter };
