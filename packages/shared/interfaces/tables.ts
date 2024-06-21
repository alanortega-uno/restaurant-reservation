import { TableStatus } from "../enums/table-status";

export interface Table {
  id: number;
  name: string;
  capacity: number;
  status: TableStatus;
}
