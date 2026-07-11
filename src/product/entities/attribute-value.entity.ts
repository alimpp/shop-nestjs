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

import { Attribute } from './attribute.entity';
import { ProductVariantValue } from './product-variant-value.entity';

@Entity('attribute_values')
@Index(['attributeId'])
@Index(['slug'])
export class AttributeValue {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  attributeId!: string;

  @ManyToOne(() => Attribute, (attribute) => attribute.values, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'attributeId',
  })
  attribute!: Attribute;

  @Column({
    length: 120,
  })
  value!: string;

  @Column({
    length: 120,
  })
  slug!: string;

  @Column({
    default: 0,
  })
  sortOrder!: number;

  @OneToMany(
    () => ProductVariantValue,
    (variantValue) => variantValue.attributeValue,
  )
  variantValues!: ProductVariantValue[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}