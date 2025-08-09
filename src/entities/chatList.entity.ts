import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export class ChatListEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update_at: Date;

  @Column()
  chatId: string;

  @Column()
  badge: number;
  
  @Column()
  lastMessageContent: string;

  @Column()
  lastMessageTime: Date;
}