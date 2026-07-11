import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { MediaType } from '../enums/media-type.enum';
import { Product } from './product.entity';

@Entity('product_medias')
@Index(['productId'])
@Index(['type'])
@Index(['sortOrder'])
export class ProductMedia {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  productId!: string;

  @ManyToOne(() => Product, (product) => product.medias, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'productId',
  })
  product!: Product;

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  type!: MediaType;

  @Column({
    length: 500,
  })
  url!: string;

  @Column({
    nullable: true,
    length: 100,
  })
  mimeType?: string;

  @Column({
    nullable: true,
  })
  size?: number;

  @Column({
    nullable: true,
    length: 255,
  })
  alt?: string;

  @Column({
    nullable: true,
    length: 255,
  })
  caption?: string;

  @Column({
    default: false,
  })
  isThumbnail!: boolean;

  @Column({
    default: 0,
  })
  sortOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;
}