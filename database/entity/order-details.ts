import typeorm, {
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
import OrderEntity from "./order";

@Entity({ name: "order_details" })
export default class OrderDetailEntity extends AppBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 255, nullable: true })
  accountUserId!: string;

  @Column({ length: 255, nullable: true })
  accountName!: string;

  @Column({ length: 255, nullable: true })
  accountPassword!: string;

  @Column({ length: 255, nullable: true })
  accountServer!: string;

  @Column({ length: 255, nullable: true })
  accountCharacterName!: string;

  @Column({ length: 1000, nullable: true })
  description!: string;

  @OneToOne(() => OrderEntity, (order) => order.orderDetails)
  @JoinColumn()
  order!: typeorm.Relation<OrderEntity>;
}
