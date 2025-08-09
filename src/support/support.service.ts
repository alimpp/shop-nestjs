import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SupportEntity } from 'src/entities/support.entity';
import { UserEntity } from 'src/entities/user.entity';

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
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
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
}
