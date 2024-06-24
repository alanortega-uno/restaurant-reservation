import { Router } from "express";

import { authorizeToken } from "../middleware/authorization";
import { catchAsyncErrors, catchSyncErrors } from "../utils/catch-error";

import { createReservation } from "../handlers/reservation";

const router = Router();

router.post(
  "/",
  catchSyncErrors(authorizeToken),
  catchAsyncErrors(createReservation)
);

export { router as reservationsRouter };
