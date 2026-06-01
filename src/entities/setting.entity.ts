import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SettingEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  background!: string;

  @Column()
  lang!: string;
}
