import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
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

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => ProperttyEntity, (propertty) => propertty.properttyValue)
  @JoinColumn()
  propertty: ProperttyEntity;

  @Column()
  properttyId: string;
}
