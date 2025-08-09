import { Module, ValidationPipe } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { SupportEntity } from 'src/entities/support.entity';
import { ChatListEntity } from 'src/entities/chatList.entity';

import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SupportEntity,
      ChatListEntity
    ]),
  ],
  providers: [
    SupportService,
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
