import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/categories.entity';
import { AdminEntity } from 'src/entities/admin.entity';
import { File } from 'src/entities/fileEntity';
import { UserEntity } from 'src/entities/user.entity';

export const pgConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'js68002100',
  database: 'dynamic_shop',
  entities: [UserEntity, File, AdminEntity, Category],
  autoLoadEntities: true,
  synchronize: true,
};
