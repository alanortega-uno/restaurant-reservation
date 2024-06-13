import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
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
  number_of_people: string;

  @ManyToOne(() => AccountEntity, (account) => account.reservations, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: AccountEntity;

  @ManyToOne(() => TableEntity, (table) => table.reservations, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "table_id" })
  table: TableEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
