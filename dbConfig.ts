import { AdminEntity } from 'src/entities/admin.entity';
import { File } from 'src/entities/fileEntity';
import { UserEntity } from 'src/entities/user.entity';

import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const pgConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'js68002100',
  database: 'dynamic_shop',
  entities: [UserEntity, File, AdminEntity],
  synchronize: true,
};
