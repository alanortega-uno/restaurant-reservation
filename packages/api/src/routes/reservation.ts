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

/**
 * @openapi
 * /api/reservations:
 *  get:
 *    security:
 *       - bearerAuth: []
 *    tags:
 *      - Reservations
 *    summary: Get Reservation
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/GoogleAccountInput'
 *    responses:
 *      200:
 *        description: Logged in
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoggedInAccountResponse'
 *
 *      404:
 *        description: Email not found
 *      400:
 *        description: Bad request
 *
 */
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
