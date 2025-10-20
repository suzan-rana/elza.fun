import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receipt } from './entities/receipt.entity';

@Injectable()
export class ReceiptsService {
    constructor(
        @InjectRepository(Receipt)
        private receiptRepository: Repository<Receipt>,
    ) { }

    async create(createReceiptDto: any): Promise<Receipt> {
        const result = await this.receiptRepository.insert(createReceiptDto);
        return await this.receiptRepository.findOne({ where: { id: result.identifiers[0].id } });
    }

    async findAll(): Promise<Receipt[]> {
        return this.receiptRepository.find();
    }

    async findOne(id: string): Promise<Receipt> {
        return this.receiptRepository.findOne({ where: { id } });
    }
}
