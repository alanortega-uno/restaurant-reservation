import { Router } from "express";

import { authorizeToken, isAdminAccount } from "../middleware/authorization";
import { catchAsyncErrors, catchSyncErrors } from "../utils/catch-error";

import {
  createReservation,
  cancelReservation,
  getReservation,
  updateReservation,
  getLatestTableReservation,
} from "../handlers/reservation";

const router = Router();

router.get(
  "/",
  catchSyncErrors(authorizeToken),
  catchAsyncErrors(getReservation)
);

router.get(
  "/table/:tableId",
  catchSyncErrors(authorizeToken),
  catchSyncErrors(isAdminAccount),
  catchAsyncErrors(getLatestTableReservation)
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
