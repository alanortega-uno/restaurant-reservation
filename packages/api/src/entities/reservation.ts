import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { AccountEntity } from "./account";
import { TableEntity } from "./table";

@Entity()
export class ReservationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  numberOfPeople: string;

  @Column()
  reservationTime: Date;

  @ManyToOne(() => AccountEntity, (account) => account.reservations)
  user: AccountEntity;

  @ManyToOne(() => TableEntity, (table) => table.reservations)
  table: TableEntity;
}
