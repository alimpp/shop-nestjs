import {
  Body,
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
import { ProperttyService } from 'src/propertty/propertty.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { ProperttyValueService } from './propertty-value.service';

@Controller('propertty-value')
@UseGuards(JwtAuthGuard)
export class ProperttyValueController {
  constructor(
    private readonly properttyService: ProperttyService,
    private readonly properttyValueService: ProperttyValueService,
    private readonly adminService: AdminService,
  ) {}

  @Get('/history')
  async getAllHistory() {
    const historyList = await this.properttyValueService.allHistory();

    const result = await Promise.all(
      historyList.map(async (item) => {
        const admin = await this.adminService.findAdminById(item.submiter);
        return {
          ...item,
          submiter: admin?.username || item.submiter,
        };
      }),
    );

    return result;
  }

  @Get('/all')
  async getAllItems() {
    const properties = await this.properttyValueService.getAll();
    const result = await Promise.all(
      properties.map(async (propertyValue) => {
        const submiter = await this.adminService.findAdminById(
          propertyValue.submiter,
        );
        const property = await this.properttyService.findById(
          propertyValue.properttyId,
        );
        return {
          ...propertyValue,
          properttyId: property ? property : '',
          submiter: submiter?.username || '',
        };
      }),
    );
    return result;
  }

  @Get('/trash')
  async getTrashItems() {
    const properties = await this.properttyValueService.getAllTrash();
    const result = await Promise.all(
      properties.map(async (propertyValue) => {
        const submiter = await this.adminService.findAdminById(
          propertyValue.submiter,
        );
        const property = await this.properttyService.findById(
          propertyValue.properttyId,
        );
        return {
          ...propertyValue,
          properttyId: property ? property : propertyValue.properttyId,
          submiter: submiter?.username || propertyValue.submiter,
        };
      }),
    );
    return result;
  }

  @Post('/add')
  async add(@Body() body: CreateDto, @Request() req) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');

    const newItem = await this.properttyValueService.add({
      ...body,
      submiter: req.user.id,
    });
    await this.properttyValueService.createHistory({
      submiter: req.user.id,
      content: `${newItem.name} created`,
    });

    return newItem;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateDto,
    @Request() req,
  ) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');

    const lastData = await this.properttyValueService.findById(id);
    if (!lastData)
      throw new NotFoundException(`Propertty with id ${id} not found`);

    await this.properttyValueService.update(id, body);
    await this.properttyValueService.createHistory({
      submiter: req.user.id,
      content: `${lastData.name} changed to ${body.name}`,
    });

    return {
      success: true,
      message: 'Propertty Value updated successfully',
    };
  }

  @Patch('/trash/:id')
  async trash(
    @Param('id') id: string,
    @Body() body: UpdateDto,
    @Request() req,
  ) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');

    const lastData = await this.properttyValueService.findById(id);
    if (!lastData)
      throw new NotFoundException(`Propertty with id ${id} not found`);

    await this.properttyValueService.update(id, body);
    await this.properttyValueService.createHistory({
      submiter: req.user.id,
      content: `${lastData.name} move to trash`,
    });

    return {
      success: true,
      message: 'Trash successfully',
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (!admin) throw new UnauthorizedException('Unauthorized access');

    const lastData = await this.properttyValueService.findById(id);
    if (!lastData)
      throw new NotFoundException(`Propertty with id ${id} not found`);

    await this.properttyValueService.remove(id);
    await this.properttyValueService.createHistory({
      submiter: req.user.id,
      content: `${lastData.name} deleted`,
    });

    return {
      success: true,
      message: 'Propertty Value deleted',
    };
  }
}
