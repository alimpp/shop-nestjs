import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UsersDataEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  userId: string;

  @Column()
  os: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
