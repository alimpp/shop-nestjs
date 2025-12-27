import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  submiter: string;

  @Column()
  imageId: string;

  @Column()
  iconId: string;

  @Column()
  trash: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
