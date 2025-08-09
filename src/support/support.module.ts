import { Module, ValidationPipe } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { SupportEntity } from 'src/entities/support.entity';
import { UserEntity } from 'src/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SupportEntity,
      UserEntity,
    ]),
  ],
  providers: [
    SupportService,
    UsersService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
  controllers: [SupportController]
})
export class SupportModule {}
