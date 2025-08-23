import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  to: string;

  @Column()
  type: string;

  @Column()
  content: string;

  @Column()
  seen: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
