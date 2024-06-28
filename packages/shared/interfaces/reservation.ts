import { AccountEntityData } from "./account";
import { TableEntityData } from "./tables";

export interface ReservationEntityData {
  id: number;
  name: string;
  number_of_people: number;
  phone: string;
  status: number;
  created_at?: string;
  updated_at?: string;
  table?: TableEntityData;
  account?: AccountEntityData;
}
