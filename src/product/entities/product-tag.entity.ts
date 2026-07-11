import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { Product } from './product.entity';
import { Tag } from './tag.entity';

@Entity('product_tags')
@Index(['productId', 'tagId'], {
  unique: true,
})
export class ProductTag {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  productId!: string;

  @Column()
  tagId!: string;

  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'productId',
  })
  product!: Product;

  @ManyToOne(() => Tag, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'tagId',
  })
  tag!: Tag;

  @Column({
    default: 0,
  })
  sortOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;
}