import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class BannersEntity {
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

  @Column()
  link: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
