import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BlogsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  readingTime: number;

  @Column()
  like: number;

  @Column()
  comment: number;

  @Column()
  title: string;

  @Column()
  subTitle: string;

  @Column()
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  sections: Array<{
    title: string;
    subTitle: string;
    description: string;
  }>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
