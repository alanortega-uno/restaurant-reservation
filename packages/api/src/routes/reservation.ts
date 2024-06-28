import { Router } from "express";

import { authorizeToken } from "../middleware/authorization";
import { catchAsyncErrors, catchSyncErrors } from "../utils/catch-error";

import {
  createReservation,
  cancelReservation,
  getReservation,
  updateReservation,
} from "../handlers/reservation";

const router = Router();

router.get(
  "/",
  catchSyncErrors(authorizeToken),
  catchAsyncErrors(getReservation)
);

router.post(
  "/",
  catchSyncErrors(authorizeToken),
  catchAsyncErrors(createReservation)
);

router.patch(
  "/:id",
  catchSyncErrors(authorizeToken),
  catchAsyncErrors(cancelReservation)
);

router.put(
  "/:id",
  catchSyncErrors(authorizeToken),
  catchAsyncErrors(updateReservation)
);

export { router as reservationsRouter };
