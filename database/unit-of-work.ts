import { DataSource, DataSourceOptions } from "typeorm";
import "reflect-metadata";
import {
  UserEntity,
  AccountEntity,
  SessionEntity,
  VerificationTokenEntity,
} from "./entity/entities";
import { ProductItem } from "./entity/product_item";
import { Product } from "./entity/product";
import { OrderEntity } from "./entity/order";

export const sqliteConfigs = {
  type: "sqlite",
  database: "db.sqlite",
  entities: [
    UserEntity,
    AccountEntity,
    SessionEntity,
    VerificationTokenEntity,
    ProductItem,
    Product,
    OrderEntity,
  ],
  synchronize: false,
  logging: false,
};

export const pgConfigs = {
  type: "postgres",
  database: process.env.POSTGRES_DB as string,
  port: process.env.POSTGRES_PORT as string,
  username: process.env.POSTGRES_USER as string,
  password: process.env.POSTGRES_PASSWORD as string,
  host: process.env.POSTGRES_HOST as string,
  entities: [
    UserEntity,
    AccountEntity,
    SessionEntity,
    VerificationTokenEntity,
    ProductItem,
    Product,
    OrderEntity,
  ],
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  synchronize: false,
  logging: false,
};

export const dbConfigs = () => {
  if (process.env.DB_TYPE === "postgres") {
    return pgConfigs as DataSourceOptions;
  } else if (process.env.DB_TYPE === "sqlite3") {
    return sqliteConfigs as DataSourceOptions;
  } else {
    throw new Error("Missing DB configuration");
  }
};

export default class UnitOfWork {
  AppDataSource: DataSource;
  dbConfigs: DataSourceOptions;
  constructor() {
    this.dbConfigs = dbConfigs();
    this.AppDataSource = new DataSource(this.dbConfigs);
  }

  async initialize() {
    return this.AppDataSource.initialize();
  }

  get ProuductRepository() {
    return this.AppDataSource.getRepository(Product);
  }

  get ProuductItemRepository() {
    return this.AppDataSource.getRepository(ProductItem);
  }

  get OrderRepository() {
    return this.AppDataSource.getRepository(OrderEntity);
  }

  get UserRepository() {
    return this.AppDataSource.getRepository(UserEntity);
  }
}
