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

import { Category } from '../../categories/entities/categories.entity';
import { ProductStatus } from '../enums/product-status.enum';
import { ProductVisibility } from '../enums/product-visibility.enum';
import { Brand } from './brand.entity';
import { ProductMedia } from './product-media.entity';
import { ProductOption } from './product-option.entity';
import { ProductTag } from './product-tag.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('products')
@Index(['slug'], { unique: true })
@Index(['sku'], { unique: true })
@Index(['categoryId'])
@Index(['brandId'])
@Index(['status'])
@Index(['price'])
@Index(['isActive'])
@Index(['isFeatured'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    length: 200,
  })
  name!: string;

  @Column({
    unique: true,
    length: 220,
  })
  slug!: string;

  @Column({
    type: 'text',
  })
  description!: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  shortDescription?: string;

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
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  salePrice?: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  costPrice?: number;

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
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
  })
  weight?: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
  })
  length?: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
  })
  width?: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
  })
  height?: number;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.DRAFT,
  })
  status!: ProductStatus;

  @Column({
    type: 'enum',
    enum: ProductVisibility,
    default: ProductVisibility.PUBLIC,
  })
  visibility!: ProductVisibility;

  @Column({
    default: false,
  })
  isFeatured!: boolean;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @Column({
    default: 0,
  })
  soldCount!: number;

  @Column({
    default: 0,
  })
  viewCount!: number;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  publishedAt?: Date;

  /*
   |--------------------------------------------------------------------------
   | SEO
   |--------------------------------------------------------------------------
   */

  @Column({
    nullable: true,
    length: 255,
  })
  metaTitle?: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  metaDescription?: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  keywords?: string;

  @Column({
    nullable: true,
    length: 500,
  })
  canonical?: string;

  @Column({
    nullable: true,
    length: 500,
  })
  ogImage?: string;

  /*
   |--------------------------------------------------------------------------
   | Category
   |--------------------------------------------------------------------------
   */

  @Column()
  categoryId!: string;

  @ManyToOne(() => Category, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'categoryId',
  })
  category!: Category;

  /*
   |--------------------------------------------------------------------------
   | Brand
   |--------------------------------------------------------------------------
   */

  @Column({
    nullable: true,
  })
  brandId?: string;

  @ManyToOne(() => Brand, (brand) => brand.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'brandId',
  })
  brand?: Brand;

  /*
   |--------------------------------------------------------------------------
   | Relations
   |--------------------------------------------------------------------------
   */
  @OneToMany(
  () => ProductOption,
  (option) => option.product,
  {
    cascade: true,
  },
)
options!: ProductOption[];

  @OneToMany(() => ProductMedia, (media) => media.product, {
    cascade: false,
  })
  medias!: ProductMedia[];

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: false,
  })
  variants!: ProductVariant[];

  @OneToMany(() => ProductTag, (productTag) => productTag.product, {
    cascade: false,
  })
  productTags!: ProductTag[];

  /*
   |--------------------------------------------------------------------------
   | Dates
   |--------------------------------------------------------------------------
   */

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}