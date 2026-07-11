    import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';


import { AttributeValue } from './attribute-value.entity';
import { ProductOption } from './product-option.entity';


@Entity('product_option_values')
@Index(
  ['productOptionId','attributeValueId'],
  {
    unique:true,
  }
)
export class ProductOptionValue {


  @PrimaryGeneratedColumn('uuid')
  id!:string;



  @Column()
  productOptionId!:string;



  @ManyToOne(
    ()=>ProductOption,
    option=>option.values,
    {
      onDelete:'CASCADE'
    }
  )
  @JoinColumn({
    name:'productOptionId'
  })
  productOption!:ProductOption;




  @Column()
  attributeValueId!:string;



  @ManyToOne(
    ()=>AttributeValue,
    {
      onDelete:'RESTRICT'
    }
  )
  @JoinColumn({
    name:'attributeValueId'
  })
  attributeValue!:AttributeValue;

}