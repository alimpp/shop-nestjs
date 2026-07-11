import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Product } from './product.entity';

@Entity('brands')
@Index(['slug'], { unique: true })
@Index(['isActive'])
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    length: 120,
  })
  name!: string;

  @Column({
    length: 150,
    unique: true,
  })
  slug!: string;

  @Column({
    nullable: true,
    length: 500,
  })
  logo?: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  description?: string;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @OneToMany(() => Product, (product) => product.brand)
  products!: Product[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}