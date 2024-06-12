import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { AccountEntity } from "./account";
import { TableEntity } from "./table";

@Entity("reservation")
export class ReservationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  numberOfPeople: string;

  @ManyToOne(() => AccountEntity, (account) => account.reservations)
  user: AccountEntity;

  @ManyToOne(() => TableEntity, (table) => table.reservations)
  table: TableEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
