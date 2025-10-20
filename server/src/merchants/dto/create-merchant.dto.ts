import { IsEmail, IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMerchantDto {
    @ApiProperty({ description: 'Wallet address of the merchant' })
    @IsString()
    walletAddress: string;

    @ApiProperty({ description: 'Email address of the merchant' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Business name', required: false })
    @IsOptional()
    @IsString()
    businessName?: string;

    @ApiProperty({ description: 'Logo URL', required: false })
    @IsOptional()
    @IsUrl()
    logoUrl?: string;

    @ApiProperty({ description: 'Website URL', required: false })
    @IsOptional()
    @IsUrl()
    website?: string;

    @ApiProperty({ description: 'Business description', required: false })
    @IsOptional()
    @IsString()
    description?: string;
}
