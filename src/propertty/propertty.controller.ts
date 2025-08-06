import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Param, 
  Body, 
  UseGuards,
  Request,
  UnauthorizedException,
  NotFoundException
} from '@nestjs/common';
import { ProperttyService } from './propertty.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { AdminService } from 'src/admin/admin.service';

@Controller('propertty')
@UseGuards(JwtAuthGuard)
export class ProperttyController {
    constructor(
        private readonly properttyService: ProperttyService,
        private readonly adminService: AdminService
    ) {}

    @Get('/history')
    async getAllHistory() {
        const historyList = await this.properttyService.allHistory();

        const result = await Promise.all(historyList.map(async (item) => {
        const admin = await this.adminService.findAdminById(item.submiter);
        return {
            ...item,
            submiter: admin?.username || item.submiter 
        };
        }));

        return result;
    }

    @Get('/all')
    async getAllItems() {
        return await this.properttyService.getAll();
    }

    @Post('/add')
    async add(@Body() body: CreateDto,@Request() req) {    

        const admin = await this.adminService.findAdminById(req.user.id)    
        if(!admin) throw new UnauthorizedException('Unauthorized access');

        const newItem = await this.properttyService.add({...body, submiter: req.user.id});
        await this.properttyService.createHistory({submiter: req.user.id, content: `Propertty ${newItem.name} created`})

        return newItem
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() body: UpdateDto,
        @Request() req
    ) {

        const admin = await this.adminService.findAdminById(req.user.id);
        if(!admin) throw new UnauthorizedException('Unauthorized access');

        const lastData = await this.properttyService.findById(id);
        if(!lastData) throw new NotFoundException(`Propertty with id ${id} not found`)

        await this.properttyService.update(id, body);
        await this.properttyService.createHistory({
        submiter: req.user.id,
        content: `Propertty ${lastData.name} changed to ${body.name}`
        });

        return {
        success: true,
        message: 'Propertty updated successfully'
        };
    }

    @Delete(':id')
    async delete(@Param('id') id: string,@Request() req) {

        const admin = await this.adminService.findAdminById(req.user.id)    
        if(!admin) throw new UnauthorizedException('Unauthorized access'); 

        const lastData = await this.properttyService.findById(id);
        if(!lastData) throw new NotFoundException(`Propertty with id ${id} not found`)

        await this.properttyService.remove(id);
        await this.properttyService.createHistory({
        submiter: req.user.id,
        content: `Propertty ${lastData.name} deleted`
        });

        return {
        success: true,
        message: 'Propertty deleted'
        };
    }
}
