import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class StylesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user: string;

  @Column({ default: 'light' })
  theme: string;

  @Column({ default: 'standard' })
  title: string;

  @Column({ default: 'standard' })
  subTitle: string;

  @Column({ default: 'standard' })
  descrption: string;

  @Column({ default: 'standard' })
  text: string;

  @Column({ default: 'standard' })
  label: string;

  @Column({ default: 'standard' })
  date: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
