import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class AddressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  content: string;

  @Column()
  postalCode: string;

  @Column()
  userId: string;

  @Column()
  default: boolean;

  @Column()
  pin: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
