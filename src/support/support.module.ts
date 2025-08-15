import { Module, ValidationPipe } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { SupportEntity } from 'src/entities/support.entity';
import { ChatListEntity } from 'src/entities/chatList.entity';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationEntity } from 'src/entities/notification.entity';
import { AdminService } from 'src/admin/admin.service';
import { AdminEntity } from 'src/entities/admin.entity';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/entities/user.entity';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SupportEntity,
      ChatListEntity,
      NotificationEntity,
      AdminEntity,
      UserEntity,
    ]),
  ],
  providers: [
    SupportService,
    NotificationService,
    AdminService,
    UsersService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
  controllers: [SupportController],
})
export class SupportModule {}
