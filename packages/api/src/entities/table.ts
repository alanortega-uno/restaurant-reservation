import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { ReservationEntity } from "./reservation";
import { TableStatus } from "@restaurant-reservation/shared";
import { IsEnum } from "class-validator";

@Entity("table")
export class TableEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column()
  capacity: number;

  @Column({
    type: "enum",
    enum: TableStatus,
    default: TableStatus.available,
  })
  @IsEnum(TableStatus)
  status: TableStatus;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.table)
  reservations: ReservationEntity[];
}
