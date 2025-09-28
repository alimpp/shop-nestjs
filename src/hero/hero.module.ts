import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroEntity } from 'src/entities/hero.entity';
import { HeroController } from './hero.controller';
import { HeroService } from './hero.service';
import { AdminService } from 'src/admin/admin.service';
import { AdminEntity } from 'src/entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HeroEntity, AdminEntity])],
  providers: [
    HeroService,
    AdminService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
  controllers: [HeroController],
})
export class HeroModule {}
