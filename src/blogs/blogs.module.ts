import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from 'src/admin/admin.service';
import { AdminEntity } from 'src/entities/admin.entity';
import { BlogsEntity } from 'src/entities/blogs.entity';
import { BlogsCommentEntity } from 'src/entities/blogsComment.entity';
import { BlogsLikeEntity } from 'src/entities/blogsLike.entity';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlogsEntity,
      BlogsCommentEntity,
      BlogsLikeEntity,
      AdminEntity,
    ]),
  ],

  providers: [
    BlogsService,
    AdminService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
  controllers: [BlogsController],
})
export class BlogsModule {}
