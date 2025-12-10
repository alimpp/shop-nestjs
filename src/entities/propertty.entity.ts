import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
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

  @Column()
  trash: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(
    () => ProperttyValueEntity,
    (properttyValue) => properttyValue.property,
  )
  properttyValues: ProperttyValueEntity[];
}
