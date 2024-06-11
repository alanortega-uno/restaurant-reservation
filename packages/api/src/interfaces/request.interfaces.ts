import { Request } from "express";
import { Account } from "./account.interfaces";

export interface AccountRequest extends Request {
  account?: Account;
}
