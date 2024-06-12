import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("refresh_token")
export class RefreshTokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  accountId: number;

  @Column()
  token: string;
}
