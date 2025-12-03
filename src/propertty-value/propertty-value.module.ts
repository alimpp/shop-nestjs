import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProperttyValueEntity } from 'src/entities/properttyValue.entity';
import { ProperttyValueHistoryEntity } from 'src/entities/properttyValueHistory.entity';
import { ProperttyValueController } from './propertty-value.controller';
import { ProperttyValueService } from './propertty-value.service';

import { AdminService } from 'src/admin/admin.service';
import { AdminEntity } from 'src/entities/admin.entity';

import { ProperttyEntity } from 'src/entities/propertty.entity';
import { ProperttyHistoryEntity } from 'src/entities/properttyHistory.entity';
import { ProperttyService } from 'src/propertty/propertty.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProperttyValueEntity,
      ProperttyValueHistoryEntity,
      ProperttyEntity,
      ProperttyHistoryEntity,
      AdminEntity,
    ]),
  ],
  providers: [
    ProperttyValueService,
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
  controllers: [ProperttyValueController],
})
export class ProperttyValueModule {}
