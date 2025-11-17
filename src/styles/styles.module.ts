import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StylesEntity } from 'src/entities/styles.entity';
import { StylesController } from './styles.controller';
import { StylesService } from './styles.service';

@Module({
  imports: [TypeOrmModule.forFeature([StylesEntity])],
  providers: [
    StylesService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
  controllers: [StylesController],
})
export class StylesModule {}
