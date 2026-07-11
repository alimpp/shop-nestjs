import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Attribute } from './attribute.entity';
import { ProductOptionValue } from './product-option-value.entity';
import { Product } from './product.entity';


@Entity('product_options')
@Index(['productId'])
export class ProductOption {

  @PrimaryGeneratedColumn('uuid')
  id!: string;


  @Column()
  productId!: string;


  @ManyToOne(
    () => Product,
    (product) => product.options,
    {
      onDelete:'CASCADE',
    }
  )
  @JoinColumn({
    name:'productId'
  })
  product!: Product;



  @Column()
  attributeId!: string;


  @ManyToOne(
    () => Attribute,
    {
      onDelete:'RESTRICT'
    }
  )
  @JoinColumn({
    name:'attributeId'
  })
  attribute!: Attribute;



  @Column({
    default:0
  })
  sortOrder!:number;



  @OneToMany(
    ()=>ProductOptionValue,
    value=>value.productOption,
    {
      cascade:true
    }
  )
  values!:ProductOptionValue[];



  @CreateDateColumn()
  createdAt!:Date;


  @UpdateDateColumn()
  updatedAt!:Date;

}