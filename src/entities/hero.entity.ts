import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class HeroEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imageId: string;

  @Column()
  title: string;

  @Column()
  subTitle: string;

  @Column()
  descrption: string;

  @Column()
  active: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
