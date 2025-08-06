import { Module, ValidationPipe } from '@nestjs/common';
import { ProperttyService } from './propertty.service';
import { ProperttyController } from './propertty.controller';
import { ProperttyEntity } from 'src/entities/propertty.entity';
import { ProperttyHistoryEntity } from 'src/entities/properttyHistory.entity';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminService } from 'src/admin/admin.service';
import { AdminEntity } from 'src/entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProperttyEntity,
      ProperttyHistoryEntity,
      AdminEntity,
    ]),
  ],
  providers: [
    ProperttyService,
    AdminService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
  controllers: [ProperttyController]
})
export class ProperttyModule {}
