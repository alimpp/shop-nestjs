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
import { SupportService } from './support.service';
import { SendDto } from './dto/sendMsg.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@Controller('support')
@UseGuards(JwtAuthGuard)
export class SupportController {
    constructor(private readonly supportService: SupportService) {}

    @Get(':chatId')
    async getMessagesByChatId(@Param('chatId') chatId: string, @Request() req) {
        const messages = await this.supportService.getMessagesByChatId(chatId);
        return messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }

    @Post('/send-message')
    async sendMessage(@Body() body: SendDto, @Request() req) {
      const newMsg = {
        ...body,
        seen: false,
        from: req.user.id
      } 
      return await this.supportService.sendMessage(newMsg) 
    }

    @Patch(':id')
    async seenMessage(
        @Param('id') id: string,
        @Body() body: {seen: boolean},
        @Request() req
    ) {
       return await this.supportService.seenMessage(id, body.seen) 
    }
}
