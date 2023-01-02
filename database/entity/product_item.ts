import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BeforeInsert,
} from "typeorm";
import AppBaseEntity from "./base";
import { generateCode } from "utils/generate-code";
import { Product } from "./product";
import { PRODUCT_ITEM_STATUS } from "common/constants";

@Entity({ name: "product_items" })
export class ProductItem extends AppBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 256 })
  name!: string;

  @Column({ length: 10 })
  referenceNumber!: string;

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

  @Column({ length: 1000, nullable: true })
  images!: string;

  @Column({ length: 1000, nullable: true })
  thumbnail!: string;

  @ManyToOne(() => Product, (product) => product.productItems)
  product!: Product;

  @Column({ nullable: false })
  productId!: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;

  @BeforeInsert()
  beforeInsertActions() {
    this.referenceNumber = generateCode(10);
  }
}
