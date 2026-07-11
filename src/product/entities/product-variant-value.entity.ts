import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { AttributeValue } from './attribute-value.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('product_variant_values')
@Index(['variantId', 'attributeValueId'], {
  unique: true,
})
export class ProductVariantValue {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  variantId!: string;

  @Column()
  attributeValueId!: string;

  @ManyToOne(
    () => ProductVariant,
    (variant) => variant.values,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'variantId',
  })
  variant!: ProductVariant;

  @ManyToOne(
    () => AttributeValue,
    (attributeValue) => attributeValue.variantValues,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'attributeValueId',
  })
  attributeValue!: AttributeValue;
}