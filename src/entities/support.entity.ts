import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class SupportEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column()
  chatId: string;

  @Column()
  type: string;
  
  @Column()
  seen: Boolean;

  @Column()
  content: string;

  @Column()
  from: string;
}