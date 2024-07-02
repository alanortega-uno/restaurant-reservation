import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ReservationEntity } from "./reservation";
import { TableStatus } from "../../../shared/index";
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
