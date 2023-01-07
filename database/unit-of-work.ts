import { DataSource, DataSourceOptions } from "typeorm";
import {
  UserEntity,
  AccountEntity,
  SessionEntity,
  VerificationTokenEntity,
} from "./entity/entities";
import ProductItemEntity from "./entity/product_item";
import ProductEntity from "./entity/product";
import OrderEntity from "./entity/order";
import OrderDetailEntity from "./entity/order-details";

export const sqliteConfigs = {
  type: "sqlite",
  database: "db.sqlite",
  entities: [
    UserEntity,
    AccountEntity,
    SessionEntity,
    VerificationTokenEntity,
    ProductItemEntity,
    ProductEntity,
    OrderEntity,
    OrderDetailEntity,
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
    ProductItemEntity,
    ProductEntity,
    OrderEntity,
    OrderDetailEntity,
  ],
  ssl: process.env.POSTGRES_SSL === "true" ? true : false,
  extra:
    process.env.POSTGRES_SSL === "true"
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {},
  synchronize: false,
  logging: process.env.POSTGRES_LOGGING === "true" ? true : false,
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
    return this.AppDataSource.getRepository(ProductEntity);
  }

  get ProuductItemRepository() {
    return this.AppDataSource.getRepository(ProductItemEntity);
  }

  get OrderRepository() {
    return this.AppDataSource.getRepository(OrderEntity);
  }

  get OrderDetailsRepository() {
    return this.AppDataSource.getRepository(OrderDetailEntity);
  }

  get UserRepository() {
    return this.AppDataSource.getRepository(UserEntity);
  }
}
