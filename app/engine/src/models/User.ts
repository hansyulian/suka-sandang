import { Optional } from 'sequelize';
import {
  Column,
  Table,
} from 'sequelize-typescript';

import {
  BaseAttributes,
  BaseModel,
} from '~/base/BaseModel';

export type UserStatus = 'pending' | 'active' | 'suspended';
export type UserAttributes = BaseAttributes & {
  name: string;
  email: string;
  password: string;
  status: UserStatus;
};
export type UserCreationAttributes = Optional<UserAttributes, 'id'>


@Table
export class User extends BaseModel<UserAttributes, UserCreationAttributes> {

  @Column
  declare name: string;

  @Column
  declare email: string;

  @Column
  declare password: string;

  @Column
  declare status: UserStatus;

};