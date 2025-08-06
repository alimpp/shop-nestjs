import { Module } from '@nestjs/common';
import { ProperttyValueService } from './propertty-value.service';
import { ProperttyValueController } from './propertty-value.controller';

@Module({
  providers: [ProperttyValueService],
  controllers: [ProperttyValueController]
})
export class ProperttyValueModule {}
