import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckoutConfig } from './entities/checkout-config.entity';
import { CreateCheckoutConfigDto, UpdateCheckoutConfigDto } from './dto/checkout-config.dto';

@Injectable()
export class CheckoutService {
    constructor(
        @InjectRepository(CheckoutConfig)
        private checkoutConfigRepository: Repository<CheckoutConfig>,
    ) { }

    async create(merchantId: string, createCheckoutConfigDto: CreateCheckoutConfigDto): Promise<CheckoutConfig> {
        try {
            const checkoutConfig = this.checkoutConfigRepository.create({
                ...createCheckoutConfigDto,
                merchant: { id: merchantId }
            });

            return await this.checkoutConfigRepository.save(checkoutConfig);
        } catch (error) {
            throw new BadRequestException(`Failed to create checkout configuration: ${error.message}`);
        }
    }

    async findAll(merchantId: string): Promise<CheckoutConfig[]> {
        return this.checkoutConfigRepository.find({
            where: { merchant: { id: merchantId } },
            order: { createdAt: 'DESC' },
            relations: ['merchant']
        });
    }

    async findOne(merchantId: string, id: string): Promise<CheckoutConfig> {
        const checkoutConfig = await this.checkoutConfigRepository.findOne({
            where: {
                id,
                merchant: { id: merchantId }
            },
            relations: ['merchant']
        });

        if (!checkoutConfig) {
            throw new NotFoundException('Checkout configuration not found');
        }

        return checkoutConfig;
    }

    async update(merchantId: string, id: string, updateCheckoutConfigDto: UpdateCheckoutConfigDto): Promise<CheckoutConfig> {
        const checkoutConfig = await this.findOne(merchantId, id);

        try {
            await this.checkoutConfigRepository.update(id, updateCheckoutConfigDto);
            return await this.findOne(merchantId, id);
        } catch (error) {
            throw new BadRequestException(`Failed to update checkout configuration: ${error.message}`);
        }
    }

    async remove(merchantId: string, id: string): Promise<void> {
        const checkoutConfig = await this.findOne(merchantId, id);
        await this.checkoutConfigRepository.remove(checkoutConfig);
    }

    // Public method to get checkout config by ID (for public checkout pages)
    async findPublicConfig(id: string): Promise<CheckoutConfig> {
        const checkoutConfig = await this.checkoutConfigRepository.findOne({
            where: {
                id,
                isActive: true
            },
            relations: ['merchant']
        });

        if (!checkoutConfig) {
            throw new NotFoundException('Checkout configuration not found or inactive');
        }

        return checkoutConfig;
    }
}
