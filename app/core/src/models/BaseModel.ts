import { BeforeDestroy, Column, DeletedAt, Model } from "sequelize-typescript";
import { v4 } from "uuid";

export abstract class BaseModel<
  ModelAttributes extends {},
  ModelCreationAttributes extends {}
> extends Model<ModelAttributes, ModelCreationAttributes> {
  @Column({
    primaryKey: true,
    defaultValue: v4,
  })
  declare id: string;

  @DeletedAt
  declare deletedAt: Date | undefined;

  @BeforeDestroy
  static baseSetStatusDeleted(instance: any) {
    instance.status = "deleted";
  }
}

export type SequelizeCreationPreset<T> = T & { id?: string };
