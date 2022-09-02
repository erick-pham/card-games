import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import AppBaseEntity from "./base";

import { Product } from "./product";
import { PRODUCT_ITEM_STATUS } from "../../common/constants";

@Entity()
export class ProductItem extends AppBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 256 })
  name!: string;

  @Column({ length: 50, nullable: true })
  type!: string;

  @Column()
  price!: number;

  @Column({ length: 3 })
  currency!: string;

  @Column({
    default: PRODUCT_ITEM_STATUS.NEW,
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
