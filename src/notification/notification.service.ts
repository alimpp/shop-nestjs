import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from 'src/entities/notification.entity';
@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(NotificationEntity)
        private readonly notificationRepository: Repository<NotificationEntity>
    ) {}

    async getNotification(to: string) {
        return this.notificationRepository.find({ where: { to } })
    }

    async addNotification(body: {content: string, to: string, seen: boolean}) {
        const notif = this.notificationRepository.create(body)
        return await this.notificationRepository.save(notif)
    }

    async seen(id: string, seen: boolean) {
        return this.notificationRepository.update(id, { seen })
    }
}
