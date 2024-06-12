import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ReservationEntity } from "./reservation";

@Entity()
export class TableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @Column()
  capacity: number;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.table)
  reservations: ReservationEntity[];
}
