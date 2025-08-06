import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class ProperttyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string

  @Column()
  submiter: string

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
