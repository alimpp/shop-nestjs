import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    InjectRepository,
} from '@nestjs/typeorm';

import {
    Repository
} from 'typeorm';


import { Product } from './entities/product.entity';

import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { ProductStatus } from './enums/product-status.enum';


@Injectable()
export class ProductService {


  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

  ) {}



  /*
  |--------------------------------------------------------------------------
  | Create
  |--------------------------------------------------------------------------
  */


  async create(
    dto: CreateProductDto,
  ): Promise<Product> {


    const product =
      this.productRepository.create(dto);


    return await this.productRepository.save(
      product,
    );

  }





  /*
  |--------------------------------------------------------------------------
  | Find All
  |--------------------------------------------------------------------------
  */


  async findAll(
    query: QueryProductDto,
  ) {


    const {
      search,
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      status,
      isActive,
      isFeatured,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',

    } = query;



    const qb =
      this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect(
        'product.category',
        'category',
      )
      .leftJoinAndSelect(
        'product.brand',
        'brand',
      )
      .leftJoinAndSelect(
        'product.medias',
        'medias',
      )
      .leftJoinAndSelect(
        'product.variants',
        'variants',
      )
      .where(
        'product.deletedAt IS NULL',
      );




    if(search){

      qb.andWhere(
        `
        product.name ILIKE :search
        OR product.sku ILIKE :search
        `,
        {
          search:`%${search}%`,
        },
      );

    }




    if(categoryId){

      qb.andWhere(
        'product.categoryId = :categoryId',
        {
          categoryId,
        },
      );

    }




    if(brandId){

      qb.andWhere(
        'product.brandId = :brandId',
        {
          brandId,
        },
      );

    }





    if(status){

      qb.andWhere(
        'product.status = :status',
        {
          status,
        },
      );

    }





    if(typeof isActive !== 'undefined'){

      qb.andWhere(
        'product.isActive = :isActive',
        {
          isActive,
        },
      );

    }





    if(typeof isFeatured !== 'undefined'){

      qb.andWhere(
        'product.isFeatured = :isFeatured',
        {
          isFeatured,
        },
      );

    }





    if(minPrice){

      qb.andWhere(
        'product.price >= :minPrice',
        {
          minPrice,
        },
      );

    }





    if(maxPrice){

      qb.andWhere(
        'product.price <= :maxPrice',
        {
          maxPrice,
        },
      );

    }





    qb.orderBy(
      `product.${sortBy}`,
      sortOrder,
    );



    qb.skip(
      (page-1)*limit,
    );


    qb.take(limit);




    const [
      data,
      total,

    ] = await qb.getManyAndCount();



    return {

      data,

      meta:{
        total,
        page,
        limit,
        totalPages:
          Math.ceil(total / limit),
      },

    };


  }






  /*
  |--------------------------------------------------------------------------
  | Find One
  |--------------------------------------------------------------------------
  */


  async findOne(
    id:string,
  ){


    const product =
      await this.productRepository.findOne({

        where:{
          id,
        },

        relations:{
          category:true,
          brand:true,
          medias:true,
          variants:true,
          productTags:{
            tag:true,
          },
        },

      });



    if(!product){

      throw new NotFoundException(
        'Product not found',
      );

    }



    return product;

  }





  /*
  |--------------------------------------------------------------------------
  | Update
  |--------------------------------------------------------------------------
  */


  async update(
    id:string,
    dto:UpdateProductDto,
  ){


    const product =
      await this.findOne(id);



    Object.assign(
      product,
      dto,
    );



    return await this.productRepository.save(
      product,
    );

  }







  /*
  |--------------------------------------------------------------------------
  | Remove Soft Delete
  |--------------------------------------------------------------------------
  */


  async remove(
    id:string,
  ){


    const product =
      await this.findOne(id);



    await this.productRepository.softRemove(
      product,
    );



    return {
      message:
      'Product deleted successfully',
    };

  }





  /*
  |--------------------------------------------------------------------------
  | Restore
  |--------------------------------------------------------------------------
  */


  async restore(
    id:string,
  ){


    await this.productRepository.restore(
      id,
    );


    return {
      message:
      'Product restored successfully',
    };

  }





  /*
  |--------------------------------------------------------------------------
  | Admin Status Change
  |--------------------------------------------------------------------------
  */


  async changeStatus(
    id:string,
    status:ProductStatus,
  ){


    const product =
      await this.findOne(id);



    product.status = status;



    return await this.productRepository.save(
      product,
    );

  }


}