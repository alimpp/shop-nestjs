import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { AttributeValue } from './attribute-value.entity';

@Entity('attributes')
@Index(['slug'], { unique: true })
export class Attribute {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    length: 100,
  })
  name!: string;

  @Column({
    unique: true,
    length: 120,
  })
  slug!: string;

  @Column({
    default: true,
  })
  isFilterable!: boolean;

  @Column({
    default: 0,
  })
  sortOrder!: number;

  @OneToMany(() => AttributeValue, (value) => value.attribute)
  values!: AttributeValue[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}