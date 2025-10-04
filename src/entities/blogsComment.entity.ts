import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class BlogsCommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  blogId: string;

  @Column()
  commentFrom: string;

  @Column()
  comment: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
