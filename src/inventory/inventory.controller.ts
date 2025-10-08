import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { CreateDto, InvenotryProductsCreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly adminService: AdminService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  async getAllItems(@Request() req) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    return await this.inventoryService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/add')
  async add(@Body() body: CreateDto, @Request() req) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    return await this.inventoryService.add(body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateDto,
    @Request() req,
  ) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    const lastData = await this.inventoryService.findById(id);
    if (!lastData)
      throw new NotFoundException(`Inventory with id ${id} not found`);
    await this.inventoryService.update(id, body);
    return {
      success: true,
      message: 'Inventory updated successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    const target = await this.inventoryService.findById(id);
    if (!target)
      throw new NotFoundException(`Inventory with id ${id} not found`);
    await this.inventoryService.remove(id);
    return {
      success: true,
      message: 'Inventory deleted',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/get-products')
  async getInventoryProducts(
    @Body() body: { inventoryId: string },
    @Request() req,
  ) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    const targetInventory = await this.inventoryService.findById(
      body.inventoryId,
    );
    if (!targetInventory)
      throw new NotFoundException(
        `Inventory with id ${body.inventoryId} not found`,
      );
    return await this.inventoryService.getInventoryProducts(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/add-to-inventory')
  async addProductToInventory(
    @Body() body: InvenotryProductsCreateDto,
    @Request() req,
  ) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    const targetInventory: any = await this.inventoryService.findById(
      body.inventoryId,
    );
    if (!targetInventory)
      throw new NotFoundException(
        `Inventory with id ${body.inventoryId} not found`,
      );

    if (targetInventory) {
      if (targetInventory?.size === targetInventory.quantity) {
        throw new ConflictException('Inventory is full');
      } else {
        return await this.inventoryService.addProductToInventory(body);
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/update-quantity')
  async updateQuantity(
    @Body() body: { id: string; body: { quantity: number } },
    @Request() req,
  ) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    return await this.inventoryService.updateQuantity(body.id, body.body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/remove-product')
  async removeProductFromInventory(
    @Body()
    body: {
      inventoryId: string;
      productId: string;
    },
    @Request() req,
  ) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');
    const target = await this.inventoryService.detectProductInInventory(body);
    if (!target)
      throw new NotFoundException(
        `Product with id ${body.productId} not found`,
      );
    await this.inventoryService.removeProductFromInventory(body.productId);
    return {
      success: true,
      message: 'Product deleted',
    };
  }
}
