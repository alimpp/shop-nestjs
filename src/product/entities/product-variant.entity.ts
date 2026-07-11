import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { ProductVariantValue } from './product-variant-value.entity';
import { Product } from './product.entity';

@Entity('product_variants')
@Index(['productId'])
@Index(['sku'], { unique: true })
@Index(['isActive'])
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  productId!: string;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'productId',
  })
  product!: Product;

  @Column({
    unique: true,
    length: 120,
  })
  sku!: string;

  @Column({
    nullable: true,
    length: 120,
  })
  barcode?: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  price!: number;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  salePrice?: number;

  @Column({
    default: 0,
  })
  stock!: number;

  @Column({
    default: true,
  })
  manageStock!: boolean;

  @Column({
    default: false,
  })
  allowBackorder!: boolean;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 8,
    scale: 2,
  })
  weight?: number;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 8,
    scale: 2,
  })
  length?: number;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 8,
    scale: 2,
  })
  width?: number;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 8,
    scale: 2,
  })
  height?: number;

  @Column({
    nullable: true,
    length: 500,
  })
  image?: string;

  @Column({
    default: true,
  })
  isDefault!: boolean;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @OneToMany(
    () => ProductVariantValue,
    (value) => value.variant,
    {
      cascade: false,
    },
  )
  values!: ProductVariantValue[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}