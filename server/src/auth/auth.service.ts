import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant } from '../merchants/entities/merchant.entity';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(Merchant)
        private merchantRepository: Repository<Merchant>,
    ) { }

    async authenticateWithWallet(walletAddress: string, signature: string): Promise<any> {
        // In a real implementation, you would verify the signature here
        // For now, we'll just check if the wallet address is valid
        if (!walletAddress || !signature) {
            throw new UnauthorizedException('Invalid wallet authentication');
        }

        // Find or create merchant
        let merchant = await this.merchantRepository.findOne({
            where: { walletAddress }
        });

        if (!merchant) {
            // Create new merchant
            merchant = this.merchantRepository.create({
                walletAddress,
                businessName: '',
                description: '',
                isActive: true,
            });
            await this.merchantRepository.save(merchant);
        }

        // Generate JWT token
        const payload = {
            sub: merchant.id,
            walletAddress: merchant.walletAddress,
            type: 'merchant'
        };

        const token = this.jwtService.sign(payload);

        return {
            token,
            user: {
                id: merchant.id,
                walletAddress: merchant.walletAddress,
                email: merchant.email,
                firstName: merchant.firstName,
                lastName: merchant.lastName,
                isOnboarded: !!(merchant.email && merchant.firstName && merchant.lastName),
                merchant: {
                    id: merchant.id,
                    businessName: merchant.businessName,
                    description: merchant.description,
                }
            }
        };
    }

    async getProfile(userId: string): Promise<any> {
        const merchant = await this.merchantRepository.findOne({
            where: { id: userId }
        });

        if (!merchant) {
            throw new UnauthorizedException('User not found');
        }

        return {
            id: merchant.id,
            walletAddress: merchant.walletAddress,
            email: merchant.email,
            firstName: merchant.firstName,
            lastName: merchant.lastName,
            isOnboarded: !!(merchant.email && merchant.firstName && merchant.lastName),
            merchant: {
                id: merchant.id,
                businessName: merchant.businessName,
                description: merchant.description,
            }
        };
    }

    async updateProfile(userId: string, updateData: any): Promise<any> {
        const merchant = await this.merchantRepository.findOne({
            where: { id: userId }
        });

        if (!merchant) {
            throw new UnauthorizedException('User not found');
        }

        // Update merchant fields
        Object.assign(merchant, updateData);
        await this.merchantRepository.save(merchant);

        return {
            id: merchant.id,
            walletAddress: merchant.walletAddress,
            email: merchant.email,
            firstName: merchant.firstName,
            lastName: merchant.lastName,
            isOnboarded: !!(merchant.email && merchant.firstName && merchant.lastName),
            merchant: {
                id: merchant.id,
                businessName: merchant.businessName,
                description: merchant.description,
            }
        };
    }
}
