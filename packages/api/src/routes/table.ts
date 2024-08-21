import { Router } from "express";

import { getAllTables } from "../handlers/table";

import { authorizeToken } from "../middleware/authorization";
import { catchAsyncErrors, catchSyncErrors } from "../utils/catch-error";

const router = Router();

/**
 * @openapi
 * /api/tables:
 *  get:
 *    security:
 *       - bearerAuth: []
 *    tags:
 *      - Table
 *    summary: Get All Tables data
 *    responses:
 *      200:
 *        description: Array of Table Entities
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/TableEntity'
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
  catchAsyncErrors(getAllTables)
);

export { router as tablesRouter };
