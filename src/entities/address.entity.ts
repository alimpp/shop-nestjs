import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AddressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string

  @Column()
  content: string;
  
  @Column()
  postalCode: string;

  @Column()
  userId: string;
}
