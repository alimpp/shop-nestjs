import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class InvenotryProductsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  inventoryId: string;

  @Column()
  productId: string;

  @Column({ default: 0 })
  quantity: number;

  @Column()
  productName: number;

  @Column()
  productSlug: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update_at: Date;
}
