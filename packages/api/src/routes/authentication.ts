import { Router } from "express";

import {
  createAccount,
  login,
  newToken,
  googleAuth,
} from "../handlers/authentication";
import { catchAsyncErrors } from "../utils/catch-error";

const router = Router();

/**
 * @openapi
 * components:
 *  schemas:
 *    AccountInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: test@email.com
 *        password:
 *          type: string
 *          default: password
 *    GoogleAccountInput:
 *      type: object
 *      required:
 *        - credential
 *      properties:
 *        credential:
 *          type: string
 *    LoggedInAccountResponse:
 *      type: object
 *      required:
 *        - email
 *        - isAdmin
 *        - tokenAccess
 *        - tokenRefresh
 *      properties:
 *        email:
 *          type: string
 *        isAdmin:
 *          type: boolean
 *        tokenAccess:
 *          type: string
 *        tokenRefresh:
 *          type: string
 *
 */

/**
 * @openapi
 * /api/auth/new-account:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: Register a user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/AccountInput'
 *    responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoggedInAccountResponse'
 *
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 *
 */
router.post("/new-account", catchAsyncErrors(createAccount));

/**
 * @openapi
 * /api/auth/login:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: Sign in a user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/AccountInput'
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
router.post("/login", catchAsyncErrors(login));

/**
 * @openapi
 * /api/auth/google:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: Sign in with a Google Account
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
router.post("/google", catchAsyncErrors(googleAuth));

router.post("/token", catchAsyncErrors(newToken));

export { router as authRouter };
