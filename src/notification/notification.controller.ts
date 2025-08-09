import { 
  Controller, 
  Get, 
  Patch, 
  Param, 
  Body, 
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@Controller('notification')
@UseGuards(JwtAuthGuard)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Get('/list')
    async getMessagesByChatId(@Request() req) {
        const list = await this.notificationService.getNotification(req.user.id);
        return list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }

    @Get('/add')
    async addNotification(body: {content: string, to: string, seen: boolean}) {
       return await this.notificationService.addNotification(body)
    }

    @Patch(':id')
    async seen(
      @Param('id') id: string,
      @Body() body: { seen: boolean },
      @Request() req
    ) {
      return await this.notificationService.seen(id, body.seen)
    }
}
