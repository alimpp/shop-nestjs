import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { StylesService } from './styles.service';
@Controller('styles')
@UseGuards(JwtAuthGuard)
export class StylesController {
  constructor(private readonly stylesService: StylesService) {}

  @Get('/all')
  async getStyles(@Req() req) {
    const styles = await this.stylesService.findById(req.user.id);
    if (styles) {
      return styles;
    } else {
      const body: CreateDto = {
        user: req.user.id,
        theme: 'light',
        title: 'standard',
        subTitle: 'standard',
        descrption: 'standard',
        text: 'standard',
        label: 'standard',
        date: 'standard',
        breadCrumb: 'standard',
        sidebarItems: 'standard',
        divider: 'standard',
      };
      return await this.stylesService.add(body);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateDto, @Req() req) {
    const styles = await this.stylesService.findById(req.user.id);
    if (!styles) throw new NotFoundException(`Styles with id ${id} not found`);
    await this.stylesService.update(id, body);
    return {
      success: true,
      message: 'styles updated successfully',
    };
  }
}
