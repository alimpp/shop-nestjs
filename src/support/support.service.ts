import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SupportEntity } from 'src/entities/support.entity';
import { ChatListEntity } from 'src/entities/chatList.entity';

interface ISendMessage {
    chatId: string;
    type: string;
    seen: Boolean;
    content: string;
    from: string;
}

@Injectable()
export class SupportService {
    constructor(
        @InjectRepository(SupportEntity)
        private readonly supportRepository: Repository<SupportEntity>,
        @InjectRepository(ChatListEntity)
        private readonly chatListRepository: Repository<ChatListEntity>
    ) {}

    async getMessagesByChatId(chatId: string) {
        return await this.supportRepository.find({ where: { chatId } })
    }

    async sendMessage(message: ISendMessage) {
        const msg = this.supportRepository.create(message)
        return await this.supportRepository.save(msg)
    }

    async seenMessage(id: string, seen: boolean) {
        return await this.supportRepository.update(id, { seen })
    }

    async findChat(chatId: string) {
       return await this.chatListRepository.findOne({ where: { chatId } })
    }

    async makeChat(
        body: {chatId : string, badge : number, lastMessageContent : string,lastMessageTime: Date}
    ) {
        const chat = this.chatListRepository.create(body)
        return await this.chatListRepository.save(chat)
    }

    async updateChat(id: string, body: any) {
       return await this.chatListRepository.update(id, body)
    }
}
