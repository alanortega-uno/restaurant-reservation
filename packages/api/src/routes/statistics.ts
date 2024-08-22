import { Router } from "express";

import { authorizeToken, isAdminAccount } from "../middleware/authorization";
import { catchAsyncErrors, catchSyncErrors } from "../utils/catch-error";
import {
  getReservationCustomRangeData,
  getThisMonthReservationData,
  getThisWeekReservationData,
} from "../handlers/statistics";

const router = Router();

/**
 * @openapi
 * components:
 *  schemas:
 *    StatisticsData:
 *      type: object
 *      required:
 *        - data
 *        - matrix
 *      properties:
 *        data:
 *          type: array
 *          items:
 *            type: array
 *            items:
 *              oneOf:
 *                - type: string
 *                - type: integer
 *        matrix:
 *          type: array
 *          items:
 *            type: array
 *            items:
 *              oneOf:
 *                - type: string
 *                - type: integer
 */

/**
 * @openapi
 * /api/statistics/this-week:
 *  get:
 *    security:
 *       - bearerAuth: []
 *    tags:
 *      - Statistics
 *    summary: Get this week reservation data. For Admins only.
 *    responses:
 *      200:
 *        description: Data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/StatisticsData'
 *
 *      400:
 *        description: Bad request
 */
router.get(
  "/this-week",
  catchSyncErrors(authorizeToken),
  catchSyncErrors(isAdminAccount),
  catchAsyncErrors(getThisWeekReservationData)
);

/**
 * @openapi
 * /api/statistics/this-month:
 *  get:
 *    security:
 *       - bearerAuth: []
 *    tags:
 *      - Statistics
 *    summary: Get this month reservation data. For Admins only.
 *    responses:
 *      200:
 *        description: Data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/StatisticsData'
 *
 *      400:
 *        description: Bad request
 */
router.get(
  "/this-month",
  catchSyncErrors(authorizeToken),
  catchSyncErrors(isAdminAccount),
  catchAsyncErrors(getThisMonthReservationData)
);

/**
 * @openapi
 * /api/statistics/custom/{startDate}/{endDate}:
 *  get:
 *    security:
 *       - bearerAuth: []
 *    tags:
 *      - Statistics
 *    summary: Get this month reservation data. For Admins only.
 *    parameters:
 *      - name: startDate
 *        in: path
 *        required: true
 *        description: Start date.
 *        schema:
 *          type: string
 *          format: date
 *      - name: endDate
 *        in: path
 *        required: true
 *        description: End date.
 *        schema:
 *          type: string
 *          format: date
 *    responses:
 *      200:
 *        description: Data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/StatisticsData'
 *
 *      400:
 *        description: Bad request
 */
router.get(
  "/custom/:startDate/:endDate",
  catchSyncErrors(authorizeToken),
  catchSyncErrors(isAdminAccount),
  catchAsyncErrors(getReservationCustomRangeData)
);

export { router as statisticsRouter };
