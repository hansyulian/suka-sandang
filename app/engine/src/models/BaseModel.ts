import { Column, DeletedAt, Model } from "sequelize-typescript";
import { v4 } from "uuid";

export type BaseAttributes = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export type MutationOmit<T, K extends keyof T = never> = Omit<
  T,
  "id" | "createdAt" | "updatedAt" | "deletedAt" | K
>;

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
  declare deletedAt: Date | null;
}
