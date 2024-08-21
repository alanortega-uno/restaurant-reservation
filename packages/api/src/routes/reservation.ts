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
 * components:
 *  schemas:
 *    ActiveReservationResponse:
 *      type: object
 *      required:
 *        - activeReservation
 *      properties:
 *        activeReservation:
 *          $ref: '#/components/schemas/ReservationResponse'
 *    ReservationResponse:
 *      type: object
 *      required:
 *        - id
 *        - name
 *        - numberOfPeople
 *        - phone
 *        - status
 *        - createdAt
 *        - updatedAt
 *        - table
 *        - account
 *      properties:
 *        id:
 *          type: number
 *        name:
 *          type: string
 *        numberOfPeople:
 *          type: number
 *        phone:
 *          type: string
 *        status:
 *          type: number
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *        table:
 *          $ref: '#/components/schemas/TableEntity'
 *        account:
 *          $ref: '#/components/schemas/AccountEntity'
 *    AccountEntity:
 *      type: object
 *      required:
 *        - id
 *        - email
 *        - is_admin
 *        - reservations
 *        - createdAt
 *        - updatedAt
 *      properties:
 *        id:
 *          type: number
 *        email:
 *          type: string
 *          format: email
 *        is_admin:
 *          type: boolean
 *        created_at:
 *          type: string
 *          format: date-time
 *        updated_at:
 *          type: string
 *          format: date-time
 *    TableEntity:
 *      type: object
 *      required:
 *        - id
 *        - name
 *        - capacity
 *        - status
 *        - reservations
 *        - created_at
 *        - updated_at
 *      properties:
 *        id:
 *          type: number
 *        name:
 *          type: string
 *        status:
 *          type: number
 *          format: int32
 *          minimum: 0
 *          maximum: 2
 *        created_at:
 *          type: string
 *          format: date-time
 *        updated_at:
 *          type: string
 *          format: date-time
 *    MakeReservation:
 *      type: object
 *      required:
 *        - name
 *        - phone
 *        - numberOfPeople
 *        - tableId
 *      properties:
 *        name:
 *          type: string
 *        phone:
 *          type: string
 *        numberOfPeople:
 *          type: number
 *          format: int32
 *        tableId:
 *          type: number
 *    MakeReservationResponse:
 *      type: object
 *      required:
 *        - message
 *        - reservation
 *      properties:
 *        message:
 *          type: string
 *        reservation:
 *          $ref: '#/components/schemas/ReservationResponse'
 *    ChangeReservation:
 *      type: object
 *      required:
 *        - name
 *        - phone
 *        - numberOfPeople
 *      properties:
 *        name:
 *          type: string
 *        phone:
 *          type: string
 *        numberOfPeople:
 *          type: number
 *          format: int32
 *    CancelReservationResponse:
 *      type: object
 *      required:
 *        - message
 *      properties:
 *        message:
 *          type: string
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */

/**
 * @openapi
 * /api/reservations:
 *  get:
 *    security:
 *       - bearerAuth: []
 *    tags:
 *      - Reservations
 *    summary: Get Reservation
 *    responses:
 *      200:
 *        description: Reservation
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ActiveReservationResponse'
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

/**
 * @openapi
 * /api/reservations/table/{tableId}:
 *  get:
 *    security:
 *       - bearerAuth: []
 *    tags:
 *      - Reservations
 *    summary: Get a table's reservation. For Admins only.
 *    parameters:
 *      - name: tableId
 *        in: path
 *        required: true
 *        description: The table id.
 *        schema:
 *          type: integer
 *          format: int32
 *    responses:
 *      200:
 *        description: Active reservation
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ActiveReservationResponse'
 *
 *      404:
 *        description: Email not found
 *      400:
 *        description: Bad request
 */
router.get(
  "/table/:tableId",
  catchSyncErrors(authorizeToken),
  catchSyncErrors(isAdminAccount),
  catchAsyncErrors(getLatestTableReservation)
);

/**
 * @openapi
 * /api/reservations:
 *  post:
 *    security:
 *       - bearerAuth: []
 *    tags:
 *      - Reservations
 *    summary: Make a reservation.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/MakeReservation'
 *    responses:
 *      200:
 *        description: Created reservation
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/MakeReservationResponse'
 *      404:
 *        description: Email not found
 *      400:
 *        description: Bad request
 */
router.post(
  "/",
  catchSyncErrors(authorizeToken),
  catchAsyncErrors(createReservation)
);

/**
 * @openapi
 * /api/reservations/{id}:
 *  patch:
 *    security:
 *       - bearerAuth: []
 *    tags:
 *      - Reservations
 *    summary: Cancel a reservation.
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The reservation id.
 *        schema:
 *          type: integer
 *          format: int32
 *    responses:
 *      200:
 *        description: Active reservation
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CancelReservationResponse'
 *
 *      404:
 *        description: Email not found
 *      400:
 *        description: Bad request
 */
router.patch(
  "/:id",
  catchSyncErrors(authorizeToken),
  catchAsyncErrors(cancelReservation)
);

/**
 * @openapi
 * /api/reservations/{id}:
 *  put:
 *    security:
 *       - bearerAuth: []
 *    tags:
 *      - Reservations
 *    summary: Change a reservation.
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: The reservation id.
 *        schema:
 *          type: integer
 *          format: int32
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ChangeReservation'
 *    responses:
 *      200:
 *        description: Active reservation
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ActiveReservationResponse'
 *
 *      404:
 *        description: Email not found
 *      400:
 *        description: Bad request
 */
router.put(
  "/:id",
  catchSyncErrors(authorizeToken),
  catchAsyncErrors(updateReservation)
);

export { router as reservationsRouter };
