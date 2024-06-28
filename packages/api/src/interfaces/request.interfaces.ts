import { Request } from "express";
import { AccountEntity } from "../entities/account";

export interface RequestWithAccount extends Request {
  account: AccountEntity;
}
