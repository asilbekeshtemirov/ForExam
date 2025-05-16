import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'products' })
export class Products extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  price: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  discount: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  rating: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  stock: number;

  @Column({ type: DataType.STRING, allowNull: false })
  status: string;

  @Column({ type: DataType.STRING })
  image_url: string;
}
