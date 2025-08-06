import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pgConfig } from 'dbConfig';

import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { UsersModule } from './users/users.module';
import { OtpModule } from './otp/otp.module';
import { AdminModule } from './admin/admin.module';
import { AddressModule } from './address/address.module';
import { CategoryModule } from './category/category.module';
import { ProperttyModule } from './propertty/propertty.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    FileModule,
    TypeOrmModule.forRoot(pgConfig),
    OtpModule,
    AdminModule,
    AddressModule,
    CategoryModule,
    ProperttyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
