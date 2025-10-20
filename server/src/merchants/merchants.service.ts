import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from './entities/merchant.entity';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';

@Injectable()
export class MerchantsService {
    constructor(
        @InjectRepository(Merchant)
        private merchantRepository: Repository<Merchant>,
    ) { }

    async create(createMerchantDto: CreateMerchantDto): Promise<Merchant> {
        const merchant = this.merchantRepository.create(createMerchantDto);
        return this.merchantRepository.save(merchant);
    }

    async findAll(): Promise<Merchant[]> {
        return this.merchantRepository.find();
    }

    async findOne(id: string): Promise<Merchant> {
        const merchant = await this.merchantRepository.findOne({ where: { id } });
        if (!merchant) {
            throw new NotFoundException(`Merchant with ID ${id} not found`);
        }
        return merchant;
    }

    async findByWalletAddress(walletAddress: string): Promise<Merchant> {
        const merchant = await this.merchantRepository.findOne({
            where: { walletAddress }
        });
        if (!merchant) {
            throw new NotFoundException(`Merchant with wallet address ${walletAddress} not found`);
        }
        return merchant;
    }

    async update(id: string, updateMerchantDto: UpdateMerchantDto): Promise<Merchant> {
        const merchant = await this.findOne(id);
        Object.assign(merchant, updateMerchantDto);
        return this.merchantRepository.save(merchant);
    }

    async remove(id: string): Promise<void> {
        const merchant = await this.findOne(id);
        await this.merchantRepository.remove(merchant);
    }
}
