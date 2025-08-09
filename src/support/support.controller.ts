import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Param, 
  Body, 
  UseGuards,
  Request,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { NotificationService } from 'src/notification/notification.service';
import { SendDto } from './dto/sendMsg.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

@Controller('support')
@UseGuards(JwtAuthGuard)
export class SupportController {

  constructor(private readonly supportService: SupportService, private readonly notificationService: NotificationService) {}

  @Get(':chatId')
  async getMessagesByChatId(@Param('chatId') chatId: string, @Request() req) {
      const messages = await this.supportService.getMessagesByChatId(chatId);
      return messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  @Post('/send-message')
  async sendMessage(@Body() body: SendDto, @Request() req) {
    const targetChat = await this.supportService.findChat(body.chatId)
    if(!targetChat) {
      const newMsg = {
        ...body,
        seen: false,
        from: req.user.id
      } 
      const newMessage = await this.supportService.sendMessage(newMsg) 
      await this.supportService.makeChat(
        {chatId: newMessage.chatId, badge: 1, lastMessageContent: newMessage.content, lastMessageTime: newMessage.created_at}
      )
    } else {
      const newMsg = {
        ...body,
        seen: false,
        from: req.user.id
      } 
      const newMessage = await this.supportService.sendMessage(newMsg) 
      await this.supportService.updateChat(targetChat.id, 
        {badge: targetChat.badge + 1, lastMessageContent: newMessage.content, lastMessageTime: newMessage.created_at}
      )
    }
  }

  @Post('/admin/send-message')
  async sendMessageAdmin(@Body() body: SendDto, @Request() req) {
    const newMsg = {
      ...body,
      seen: false,
      from: req.user.id
    } 
    await this.supportService.sendMessage(newMsg) 
    await this.notificationService.addNotification(
      {to: newMsg.chatId, content: 'New message from admin support', seen: false}
    )
  }

  @Patch(':id')
  async seenMessage(
      @Param('id') id: string,
      @Body() body: {seen: boolean, chatId: string},
      @Request() req
  ) {
      const targetChat = await this.supportService.findChat(body.chatId)
      if(targetChat) {
        await this.supportService.seenMessage(id, body.seen) 
        if(targetChat.badge != 0) {
          await this.supportService.updateChat(targetChat.id, {badge: targetChat.badge - 1})
        }
      }
  }

}
