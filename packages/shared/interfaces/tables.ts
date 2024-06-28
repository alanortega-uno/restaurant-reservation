import { TableStatus } from "../enums/table-status";

export interface TableEntityData {
  id: number;
  name: string;
  capacity: number;
  status: TableStatus;
  created_at?: string;
  updated_at?: string;
}
