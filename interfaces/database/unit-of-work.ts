import { DataSource, DataSourceOptions } from "typeorm";
import { ProductItem } from "../entity/product_item";
import { Product } from "../entity/product";
import * as entities from "../entity/entities";

export const sqliteConfigs = {
  type: "sqlite",
  database: "db.sqlite",
  entities: [Product, ProductItem, entities],
  synchronize: true,
  logging: true,
};

export const pgConfigs = {
  type: "postgres",
  database: process.env.POSTGRES_DB as string,
  port: process.env.POSTGRES_PORT as string,
  username: process.env.POSTGRES_USER as string,
  password: process.env.POSTGRES_PASSWORD as string,
  host: process.env.POSTGRES_HOST as string,
  entities: [Product, ProductItem, entities],
  // synchronize: true,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  logging: false,
};

export const dbConfigs = () => {
  if (process.env.NODE_ENV === "development") {
    return sqliteConfigs as DataSourceOptions;
  }
  return pgConfigs as DataSourceOptions;
};

export default class UnitOfWork {
  AppDataSource: DataSource;
  dbConfigs: DataSourceOptions;
  constructor() {
    if (process.env.NODE_ENV === "development") {
      this.dbConfigs = sqliteConfigs as DataSourceOptions;
    } else {
      this.dbConfigs = pgConfigs as DataSourceOptions;
    }
    this.dbConfigs = pgConfigs as DataSourceOptions;
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
}
