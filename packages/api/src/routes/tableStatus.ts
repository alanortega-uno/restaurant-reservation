import { Router } from "express";

import { authorizeToken, isAdminAccount } from "../middleware/authorization";
import { catchAsyncErrors, catchSyncErrors } from "../utils/catch-error";
import { updateTableStatus } from "../handlers/tableStatus";

const router = Router();

/**
 * @openapi
 * /api/table-status/{id}::
 *  put:
 *    security:
 *       - bearerAuth: []
 *    tags:
 *      - TableStatus
 *    summary: Update table status. For Admins only.
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The table id.
 *        schema:
 *          type: integer
 *          format: int32
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              table:
 *                $ref: '#/components/schemas/TableEntity'
 *              reservation:
 *                type: object
 *                required: false
 *                properties:
 *                  name:
 *                    type: string
 *                  phone:
 *                    type: string
 *                  numberOfPeople:
 *                    type: number
 *    responses:
 *      200:
 *        description: Update table status
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                table:
 *                  $ref: '#/components/schemas/TableEntity'
 *
 *      404:
 *        description: Email not found
 *      400:
 *        description: Bad request
 *
 */
router.put(
  "/:id",
  catchSyncErrors(authorizeToken),
  catchSyncErrors(isAdminAccount),
  catchAsyncErrors(updateTableStatus)
);

export { router as tableStatusRouter };
