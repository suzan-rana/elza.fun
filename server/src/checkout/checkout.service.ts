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
            // Generate slug if not provided
            const slug = createCheckoutConfigDto.slug || this.generateSlug(createCheckoutConfigDto.name);

            // Check if slug already exists
            const existingSlug = await this.checkoutConfigRepository.findOne({
                where: { slug }
            });

            if (existingSlug) {
                throw new BadRequestException('Slug already exists. Please choose a different slug.');
            }

            const checkoutConfig = this.checkoutConfigRepository.create({
                ...createCheckoutConfigDto,
                slug,
                merchant: { id: merchantId }
            });

            return await this.checkoutConfigRepository.save(checkoutConfig);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
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

    // Public method to get checkout config by slug (for public checkout pages)
    async findPublicConfigBySlug(slug: string): Promise<CheckoutConfig> {
        const checkoutConfig = await this.checkoutConfigRepository.findOne({
            where: {
                slug,
                isActive: true
            },
            relations: ['merchant']
        });

        if (!checkoutConfig) {
            throw new NotFoundException('Checkout configuration not found or inactive');
        }

        return checkoutConfig;
    }

    // Public method to get checkout config by custom domain
    async findPublicConfigByDomain(domain: string): Promise<CheckoutConfig> {
        const checkoutConfig = await this.checkoutConfigRepository.findOne({
            where: {
                customDomain: domain,
                isActive: true
            },
            relations: ['merchant']
        });

        if (!checkoutConfig) {
            throw new NotFoundException('Checkout configuration not found or inactive');
        }

        return checkoutConfig;
    }

    // Generate a URL-friendly slug from a name
    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .trim()
            .substring(0, 50); // Limit length
    }

    // Check if slug is available
    async isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
        const query: any = { slug };
        if (excludeId) {
            query.id = { $ne: excludeId };
        }

        const existing = await this.checkoutConfigRepository.findOne({
            where: query
        });

        return !existing;
    }
}
