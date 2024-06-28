import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  BaseEntity,
} from "typeorm";
import { AccountEntity } from "./account";
import { TableEntity } from "./table";
import { IsString, IsPhoneNumber, IsInt, Min, IsEnum } from "class-validator";
import { ReservationStatus } from "@restaurant-reservation/shared";

@Entity("reservation")
export class ReservationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsPhoneNumber("BO")
  phone: string;

  @Column()
  @IsInt()
  @Min(1)
  number_of_people: number;

  @ManyToOne(() => AccountEntity, (account) => account.reservations, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "account_id" })
  account: AccountEntity;

  @ManyToOne(() => TableEntity, (table) => table.reservations, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "table_id" })
  table: TableEntity;

  @Column({
    type: "enum",
    enum: ReservationStatus,
    default: ReservationStatus.active,
  })
  @IsEnum(ReservationStatus)
  status: ReservationStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
