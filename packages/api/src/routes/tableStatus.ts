import { Router } from "express";

import { authorizeToken, isAdminAccount } from "../middleware/authorization";
import { catchAsyncErrors, catchSyncErrors } from "../utils/catch-error";
import { updateTableStatus } from "../handlers/tableStatus";

const router = Router();

router.put(
  "/:id",
  catchSyncErrors(authorizeToken),
  catchSyncErrors(isAdminAccount),
  catchAsyncErrors(updateTableStatus)
);

export { router as tableStatusRouter };
