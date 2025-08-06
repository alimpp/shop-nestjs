import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToOne } from 'typeorm';
import { ProperttyEntity } from './propertty.entity';

@Entity()
export class ProperttyValueEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string

  @Column()
  submiter: string

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToOne(() => ProperttyEntity, (propertty) => propertty.properttyValue)
  propertty: ProperttyEntity
}
