import { BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { instanceToPlain } from "class-transformer";

export default abstract class AppBaseEntity extends BaseEntity {
  toJSON(): {} {
    const data = instanceToPlain(this);
    return JSON.parse(JSON.stringify(data));
  }
}
