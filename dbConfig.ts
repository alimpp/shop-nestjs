import { UserEntity } from 'src/entities/user.entity';
import { AdminEntity } from 'src/entities/admin.entity';
import { AddressEntity } from 'src/entities/address.entity';
import { CategoryEntity } from 'src/entities/category.entity';
import { CategoryHistoryEntity } from 'src/entities/categoryHistory.entity';
import { ProperttyEntity } from 'src/entities/propertty.entity';
import { ProperttyHistoryEntity } from 'src/entities/properttyHistory.entity';
import { ProperttyValueEntity } from 'src/entities/properttyValue.entity';
import { ProperttyValueHistoryEntity } from 'src/entities/properttyValueHistory.entity';
import { File } from 'src/entities/fileEntity';

import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const pgConfig: PostgresConnectionOptions = {
  url: 'postgresql://neondb_owner:npg_IvGm9ogrFiX7@ep-crimson-math-ad1sgzdi-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=requires',
  type: 'postgres',
  port: 3306,
  entities: [
    UserEntity,
    File,
    AdminEntity,
    AddressEntity,
    CategoryEntity,
    CategoryHistoryEntity,
    ProperttyEntity,
    ProperttyHistoryEntity,
    ProperttyValueEntity,
    ProperttyValueHistoryEntity,
  ],

  // ** synchronize in development mode should be true and in production mode should be false ** //
  synchronize: true,
};
