import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import AppBaseEntity from "./base";

import { Product } from "./product";
export const PRODUCT_STATUS = {
  NEW: "NEW",
  SELL: "SELL",
  SOLD: "SOLD",
};

@Entity()
export class ProductItem extends AppBaseEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ length: 256 })
  name!: string;

  @Column()
  price!: number;

  @Column({ length: 3 })
  currency!: string;

  @Column({
    default: PRODUCT_STATUS.NEW,
  })
  status!: string;

  @Column({ length: 256 })
  description!: string;

  @Column()
  image!: string;

  @ManyToOne(() => Product, (product) => product.productItems)
  product!: Product;

  @CreateDateColumn()
  createdAt!: Date | undefined;

  @UpdateDateColumn()
  updatedAt!: Date | undefined;
}
