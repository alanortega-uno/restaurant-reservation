import { Request } from "express";
import { Account } from "./account.interfaces";

export interface RequestWithAccount extends Request {
  account: Account;
}
