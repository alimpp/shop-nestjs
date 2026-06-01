import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  fristname!: string;

  @Column()
  lastname!: string;

  @Column()
  email!: string;

  @Column()
  avatarUrl!: string;

  @Column()
  phone!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;
}
