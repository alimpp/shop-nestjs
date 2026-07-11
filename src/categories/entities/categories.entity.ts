import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';

@Entity('categories')
@Tree('closure-table')
@Index(['slug'], { unique: true })
@Index(['isActive'])
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({
    length: 120,
    unique: true,
  })
  slug!: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  description?: string;

  @Column({
    nullable: true,
    length: 500,
  })
  image?: string;

  @Column({
    default: 0,
  })
  sortOrder!: number;

  @Column({
    default: true,
  })
  isActive!: boolean;

  @Column({
    nullable: true,
  })
  parentId?: string;

  @TreeParent({ onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parentId' })
  parent?: Category | null;

  @TreeChildren()
  children!: Category[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
