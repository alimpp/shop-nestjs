import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProperttyEntity } from './propertty.entity';

@Entity()
export class ProperttyValueEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  submiter: string;

  @Column()
  trash: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => ProperttyEntity, (property) => property.properttyValues)
  @JoinColumn({ name: 'properttyId' })
  property: ProperttyEntity;

  @Column()
  properttyId: string;
}
