import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

import AppBaseEntity from "./base";
import ProductItemEntity from "./product_item";
import { PRODUCT_STATUS } from "common/constants";
@Entity({ name: "products" })
export default class Product extends AppBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 256 })
  name!: string;

  @Column({ length: 256, nullable: true })
  type!: string;

  @Column({
    default: PRODUCT_STATUS.NEW,
  })
  status!: string;

  @Column({ length: 1000, nullable: true })
  thumbnail!: string;

  @OneToMany(() => ProductItemEntity, (productItem) => productItem.product)
  productItems: ProductItemEntity[] | undefined;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date | undefined;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date | undefined;
}
