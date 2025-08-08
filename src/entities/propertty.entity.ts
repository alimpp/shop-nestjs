import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { ProperttyValueEntity } from './properttyValue.entity';
@Entity()
export class ProperttyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  submiter: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToOne(() => ProperttyValueEntity, (propertty) => propertty.propertty)
  properttyValue: ProperttyValueEntity;
}
