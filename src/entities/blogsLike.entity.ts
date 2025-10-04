import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class BlogsLikeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  blogId: string;

  @Column()
  likedBy: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
