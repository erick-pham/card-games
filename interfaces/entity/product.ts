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
import { PRODUCT_STATUS } from "../../common/constants";
@Entity({ name: "product" })
export class Product extends AppBaseEntity {
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

  @OneToMany(() => ProductItem, (productItem) => productItem.product)
  productItems: ProductItem[] | undefined;

  @CreateDateColumn()
  createdAt: Date | undefined;

  @UpdateDateColumn()
  updatedAt: Date | undefined;
}
