import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

import AppBaseEntity from "./base";
import { ProductItem } from "./product_item";
@Entity({ name: "product" })
export class Product extends AppBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 256 })
  name!: string;

  @Column({ length: 256 })
  type!: string;

  @OneToMany(() => ProductItem, (productItem) => productItem.product)
  productItems: ProductItem[] | undefined;

  @CreateDateColumn()
  createdAt: Date | undefined;

  @UpdateDateColumn()
  updatedAt: Date | undefined;
}
