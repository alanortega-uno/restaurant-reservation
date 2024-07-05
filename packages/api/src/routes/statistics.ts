import { Router } from "express";

import { authorizeToken, isAdminAccount } from "../middleware/authorization";
import { catchAsyncErrors, catchSyncErrors } from "../utils/catch-error";
import {
  getReservationCustomRangeData,
  getThisMonthReservationData,
  getThisWeekReservationData,
} from "../handlers/statistics";

const router = Router();

router.get(
  "/this-week",
  catchSyncErrors(authorizeToken),
  catchSyncErrors(isAdminAccount),
  catchAsyncErrors(getThisWeekReservationData)
);

router.get(
  "/this-month",
  catchSyncErrors(authorizeToken),
  catchSyncErrors(isAdminAccount),
  catchAsyncErrors(getThisMonthReservationData)
);

router.get(
  "/custom/:startDate/:endDate",
  catchSyncErrors(authorizeToken),
  catchSyncErrors(isAdminAccount),
  catchAsyncErrors(getReservationCustomRangeData)
);

export { router as statisticsRouter };
