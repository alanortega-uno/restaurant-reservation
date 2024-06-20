import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ReservationEntity } from "./reservation";

@Entity("table")
export class TableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  capacity: number;

  @Column({
    default: 0,
  })
  status: number;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.table)
  reservations: ReservationEntity[];
}
