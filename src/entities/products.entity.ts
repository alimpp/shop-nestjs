import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ProductsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  submiter: string;
  
  @Column()
  name: string;
  
  @Column()
  description: string;
  @Column({ type: 'jsonb', nullable: true })
  category: Array<{
    id: string;
    name: string;
    imageId: string;
    iconId: string;
  }>;
  
  @Column({ type: 'jsonb', nullable: true })
  property: Array<{
    id: string;
    name: string;
  }>;
  
  @Column({ type: 'jsonb', nullable: true })
  property_value: Array<{
    id: string;
    name: string;
    properttyId: string;
  }>;
  
  @Column({ type: 'jsonb', nullable: true })
  tags: Array<{
    name: string;
  }>;
  
  @Column({ type: 'jsonb', nullable: true })
  relatedBlogs: Array<{
    blogId: string;
    title: string;
    subTitle: string;
    description: string;
  }>;
  
  @Column({ type: 'jsonb', nullable: true })
  images: Array<{
    imageId: string;
  }>;
  
  @Column()
  price: number;
  
  @Column()
  discount: number;
  
  @Column()
  priceAfterDiscount: number;
  
  @Column()
  like: number;
  
  @Column()
  comment: number;
  
  @Column({ type: 'jsonb', nullable: true })
  info: Array<{
    name: string;
    value: string;
  }>;
  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
}
