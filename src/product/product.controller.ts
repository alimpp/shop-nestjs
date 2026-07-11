import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';

import { ProductService } from './product.service';

import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { ProductStatus } from './enums/product-status.enum';


@Controller('products')
export class ProductController {

  constructor(
    private readonly productService: ProductService,
  ) {}


  /*
  |--------------------------------------------------------------------------
  | Create Product
  |--------------------------------------------------------------------------
  */

  @Post()
  async create(
    @Body() dto: CreateProductDto,
  ) {

    return await this.productService.create(
      dto,
    );

  }



  /*
  |--------------------------------------------------------------------------
  | Get Products
  |--------------------------------------------------------------------------
  */

  @Get()
  async findAll(
    @Query() query: QueryProductDto,
  ) {

    return await this.productService.findAll(
      query,
    );

  }




  /*
  |--------------------------------------------------------------------------
  | Get Product Detail
  |--------------------------------------------------------------------------
  */

  @Get(':id')
  async findOne(

    @Param(
      'id',
      ParseUUIDPipe,
    )
    id: string,

  ) {

    return await this.productService.findOne(
      id,
    );

  }





  /*
  |--------------------------------------------------------------------------
  | Update Product
  |--------------------------------------------------------------------------
  */

  @Patch(':id')
  async update(

    @Param(
      'id',
      ParseUUIDPipe,
    )
    id: string,


    @Body()
    dto: UpdateProductDto,

  ) {

    return await this.productService.update(
      id,
      dto,
    );

  }







  /*
  |--------------------------------------------------------------------------
  | Soft Delete Product
  |--------------------------------------------------------------------------
  */

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(

    @Param(
      'id',
      ParseUUIDPipe,
    )
    id: string,

  ) {

    return await this.productService.remove(
      id,
    );

  }







  /*
  |--------------------------------------------------------------------------
  | Restore Product
  |--------------------------------------------------------------------------
  */

  @Patch(':id/restore')
  async restore(

    @Param(
      'id',
      ParseUUIDPipe,
    )
    id: string,

  ) {

    return await this.productService.restore(
      id,
    );

  }







  /*
  |--------------------------------------------------------------------------
  | Change Status
  |--------------------------------------------------------------------------
  */

  @Patch(':id/status')
  async changeStatus(

    @Param(
      'id',
      ParseUUIDPipe,
    )
    id: string,


    @Body('status')
    status: ProductStatus,

  ) {

    return await this.productService.changeStatus(
      id,
      status,
    );

  }

}