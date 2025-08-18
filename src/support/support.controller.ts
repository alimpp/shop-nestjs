import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { NotificationService } from 'src/notification/notification.service';
import { AdminService } from 'src/admin/admin.service';
import { UsersService } from 'src/users/users.service';
import { SendDto } from './dto/sendMsg.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';

interface IChat {
  itsMe: boolean;
  id: string;
  created_at: Date;
  chatId: string;
  type: string;
  seen: Boolean;
  content: string;
  from: string;
}

@Controller('support')
@UseGuards(JwtAuthGuard)
export class SupportController {
  
  constructor(
    private readonly supportService: SupportService,
    private readonly notificationService: NotificationService,
    private readonly adminService: AdminService,
    private readonly usersSerive: UsersService,
  ) {}

  @Get('/chat-list')
  async getChatList(@Req() req) {
    const admin = await this.adminService.findAdminById(req.user.id);
    if (admin?.role == 'admin') {
      let result: any = [];
      const chats = await this.supportService.getChatList();
      for (let key of chats) {
        const user = await this.usersSerive.getUserById(key.chatId);
        const obj = {
          ...key,
          user: {
            ...user,
            fullname: user?.fristname ? user?.fristname + ' ' + user?.lastname : ''
          },
        };
        result.push(obj);
      }
      return result;
    }
  }

  @Get(':chatId')
  async getMessagesByChatId(@Param('chatId') chatId: string, @Request() req) {
    const messages = await this.supportService.getMessagesByChatId(chatId);
    const sortedList = messages.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
    let list : IChat[] = []
    for(let key of sortedList) {
      const obj: IChat = {
        ...key,
        itsMe: req.user.id == key.from ? true : false
      }
      list.push(obj)
    }
    return list
  }

  @Post('/send-message')
  async sendMessage(@Body() body: SendDto, @Request() req) {
    const targetChat = await this.supportService.findChat(body.chatId);
    if (!targetChat) {
      const newMsg = {
        ...body,
        seen: false,
        from: req.user.id,
      };
      const newMessage = await this.supportService.sendMessage(newMsg);
      await this.supportService.makeChat({
        chatId: newMessage.chatId,
        badge: 1,
        lastMessageContent: newMessage.content,
        lastMessageTime: newMessage.created_at,
      });
      return {...newMessage, itsMe: true}
    } else {
      const newMsg = {
        ...body,
        seen: false,
        from: req.user.id,
      };
      const newMessage = await this.supportService.sendMessage(newMsg);
      await this.supportService.updateChat(targetChat.id, {
        badge: targetChat.badge + 1,
        lastMessageContent: newMessage.content,
        lastMessageTime: newMessage.created_at,
      });
      return {...newMessage, itsMe: true}
    }
  }

  @Post('/admin/send-message')
  async sendMessageAdmin(@Body() body: SendDto, @Request() req) {
    const newMsg = {
      ...body,
      seen: false,
      from: req.user.id,
    };
    const result = await this.supportService.sendMessage(newMsg);
    await this.notificationService.addNotification({
      to: newMsg.chatId,
      content: 'New message from admin support',
      seen: false,
    });
    const targetChat = await this.supportService.findChat(body.chatId);
    if(targetChat) {
      await this.supportService.updateChat(targetChat.id, {
        badge: 0,
        lastMessageContent: result.content,
        lastMessageTime: result.created_at,
      });
    }
    return {...result, itsMe: true}
  }

  @Patch(':id')
  async seenMessage(
    @Param('id') id: string,
    @Body() body: { seen: boolean; chatId: string },
    @Request() req,
  ) {
    const targetChat = await this.supportService.findChat(body.chatId);
    if (targetChat) {
      await this.supportService.seenMessage(id, body.seen);
      if (targetChat.badge != 0) {
        await this.supportService.updateChat(targetChat.id, {
          badge: targetChat.badge - 1,
        });
      }
    }
  }
  
}
