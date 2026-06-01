import { AddressEntity } from 'src/entities/address.entity';
import { AdminEntity } from 'src/entities/admin.entity';
import { BannersEntity } from 'src/entities/banners.entity';
import { BlogsEntity } from 'src/entities/blogs.entity';
import { BlogsCommentEntity } from 'src/entities/blogsComment.entity';
import { BlogsLikeEntity } from 'src/entities/blogsLike.entity';
import { BrandsEntity } from 'src/entities/brand.entity';
import { CategoryEntity } from 'src/entities/category.entity';
import { CategoryHistoryEntity } from 'src/entities/categoryHistory.entity';
import { ChatListEntity } from 'src/entities/chatList.entity';
import { File } from 'src/entities/fileEntity';
import { HeroEntity } from 'src/entities/hero.entity';
import { NotificationEntity } from 'src/entities/notification.entity';
import { ProductsEntity } from 'src/entities/products.entity';
import { ProductsCommentEntity } from 'src/entities/productsComment.entity';
import { ProductsLikeEntity } from 'src/entities/productsLike.entity';
import { ProperttyEntity } from 'src/entities/propertty.entity';
import { ProperttyHistoryEntity } from 'src/entities/properttyHistory.entity';
import { ProperttyValueEntity } from 'src/entities/properttyValue.entity';
import { ProperttyValueHistoryEntity } from 'src/entities/properttyValueHistory.entity';
import { ServicesEntity } from 'src/entities/services.entity';
import { SettingEntity } from 'src/entities/setting.entity';
import { SupportEntity } from 'src/entities/support.entity';
import { UserEntity } from 'src/entities/user.entity';

import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const pgConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'js68002100',
  database: 'dynamic_shop',
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
    SupportEntity,
    ChatListEntity,
    NotificationEntity,
    HeroEntity,
    BrandsEntity,
    BannersEntity,
    ServicesEntity,
    BlogsEntity,
    BlogsLikeEntity,
    BlogsCommentEntity,
    ProductsEntity,
    ProductsLikeEntity,
    ProductsCommentEntity,
    SettingEntity,
  ],
  synchronize: true,
};
