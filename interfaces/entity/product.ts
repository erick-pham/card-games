import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

import AppBaseEntity from "./base";
import { ProductItem } from "./product_item";
@Entity()
export class Product extends AppBaseEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ length: 256 })
  name!: string;

  @Column({ length: 256 })
  type!: string;

  @OneToMany(() => ProductItem, (productItem) => productItem.product)
  productItems!: ProductItem[];

  @CreateDateColumn()
  createdAt!: Date | undefined;

  @UpdateDateColumn()
  updatedAt!: Date | undefined;
}
