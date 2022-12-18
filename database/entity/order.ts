import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";

import AppBaseEntity from "./base";
import { ProductItem } from "./product_item";
import { ORDER_STATUS } from "common/constants";
import { UserEntity } from "./entities";

@Entity({ name: "order_details" })
export class OrderDetailEntity extends AppBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 255 })
  accountUserId!: string;

  @Column({ length: 255 })
  accountName!: string;

  @Column({ length: 255 })
  accountPassword!: string;

  @Column({ length: 255 })
  accountServer!: string;

  @Column({ length: 255 })
  accountCharacterName!: string;

  @Column({ length: 1000, nullable: true })
  description!: string;
}

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

  @Column({ length: 256 })
  contactName!: string;

  @Column({ length: 256 })
  contactPhoneNumber!: string;

  @Column({ length: 256 })
  contactEmail!: string;

  @Column({
    nullable: true,
    default: ORDER_STATUS.PENDING,
  })
  status!: string;

  @Column({ type: "uuid" })
  userId!: string;

  @ManyToOne(() => UserEntity, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  user!: UserEntity;

  @Column({ type: "uuid" })
  productItemId!: string;

  @ManyToOne(() => ProductItem, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  productItem!: ProductItem;

  @OneToOne((type) => OrderDetailEntity)
  @JoinColumn()
  orderDetails!: OrderDetailEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
