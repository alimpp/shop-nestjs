import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ServicesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  subTitle: string;

  @Column()
  descrption: string;

  @Column()
  imageId: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
