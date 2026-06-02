import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SettingEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  background!: string;

  @Column()
  color!: string;

  @Column()
  lang!: string;

  @Column({ type: 'jsonb', nullable: true })
  button!: Array<{
    type: string;
    radius: string;
    background: string;
    color: string;
    border: string;
  }>;
}
