import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pgConfig } from 'dbConfig';

import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { UsersModule } from './users/users.module';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    FileModule,
    TypeOrmModule.forRoot(pgConfig),
    OtpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
