import { Module, ValidationPipe } from '@nestjs/common';
import { ProperttyValueService } from './propertty-value.service';
import { ProperttyValueController } from './propertty-value.controller';
import { ProperttyValueEntity } from 'src/entities/properttyValue.entity';
import { ProperttyValueHistoryEntity } from 'src/entities/properttyValueHistory.entity';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminService } from 'src/admin/admin.service';
import { AdminEntity } from 'src/entities/admin.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProperttyValueEntity,
      ProperttyValueHistoryEntity,
      AdminEntity,
    ]),
  ],
  providers: [
    ProperttyValueService,
    AdminService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
  controllers: [ProperttyValueController],
})
export class ProperttyValueModule {}
