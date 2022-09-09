import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import AppBaseEntity from "./base";
import { ProductItem } from "./product_item";
import { ORDER_STATUS } from "../../common/constants";
import { UserEntity } from "./entities";

@Entity({ name: "orders" })
export class OrderEntity extends AppBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 10 })
  referenceNumber!: string;

  @Column()
  amount!: number;

  @Column({ length: 1000, nullable: true })
  description!: string;

  @Column({
    nullable: true,
    default: ORDER_STATUS.PENDING,
  })
  status!: string;

  @Column({ type: "uuid", nullable: true })
  userId!: string;

  @ManyToOne(() => UserEntity, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  user!: UserEntity;

  @Column({ type: "uuid", nullable: true })
  productItemId!: string;

  @ManyToOne(() => ProductItem, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  productItem!: ProductItem;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
