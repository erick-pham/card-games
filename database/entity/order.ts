import typeorm, {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  BeforeInsert,
} from "typeorm";

import AppBaseEntity from "./base";
import { ProductItem } from "./product_item";
import { ORDER_STATUS } from "common/constants";
import { UserEntity } from "./entities";
import { generateCode } from "@utils/generate-code";
import OrderDetailEntity from "./order-details";
@Entity({ name: "orders" })
export default class OrderEntity extends AppBaseEntity {
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

  @Column({ type: "uuid", nullable: true })
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

  @OneToOne(
    () => OrderDetailEntity,
    (orderDetailEntity) => orderDetailEntity.order
  )
  orderDetails!: typeorm.Relation<OrderDetailEntity>;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;

  @BeforeInsert()
  beforeInsertActions() {
    this.referenceNumber = generateCode(10);
  }
}
