import {
  Column,
  Model,
} from 'sequelize-typescript';
import { v4 } from 'uuid';

export type BaseAttributes = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseModel<ModelAttributes extends {},ModelCreationAttributes  extends {}> extends Model<ModelAttributes,ModelCreationAttributes>{
  @Column({
    primaryKey: true,
    defaultValue: v4,
  })
  declare id: string;
}