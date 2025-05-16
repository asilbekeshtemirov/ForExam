import { Column, DataType, Model, Table } from "sequelize-typescript";
import { UserRoles } from "../enums";

@Table({ tableName: 'auth', timestamps: true })
export class User extends Model<User> { 
  @Column({})
  name: string;

  @Column({ type: DataType.ENUM, values: Object.values(UserRoles), defaultValue: UserRoles.USER })
  role: UserRoles;

  @Column({})
  email: string;

  @Column({ allowNull: true })
  password: string;

}
