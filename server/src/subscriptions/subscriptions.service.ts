import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectRepository(Subscription)
        private subscriptionRepository: Repository<Subscription>,
    ) { }

    async create(createSubscriptionDto: any): Promise<Subscription> {
        const result = await this.subscriptionRepository.insert(createSubscriptionDto);
        return await this.subscriptionRepository.findOne({ where: { id: result.identifiers[0].id } });
    }

    async findAll(): Promise<Subscription[]> {
        return this.subscriptionRepository.find();
    }

    async findOne(id: string): Promise<Subscription> {
        return this.subscriptionRepository.findOne({ where: { id } });
    }
}
