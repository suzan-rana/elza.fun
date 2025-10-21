import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEnum, IsBoolean, IsObject, MaxLength, Matches } from 'class-validator';
import { CheckoutType } from '../entities/checkout-config.entity';

export class CreateCheckoutConfigDto {
    @ApiProperty({ description: 'Checkout configuration name', maxLength: 150 })
    @IsString()
    @MaxLength(150)
    name: string;

    @ApiPropertyOptional({ description: 'Checkout configuration description', maxLength: 500 })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiPropertyOptional({ description: 'Unique slug for the checkout URL (auto-generated if not provided)', maxLength: 100 })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    @Matches(/^[a-z0-9-]+$/, { message: 'Slug must contain only lowercase letters, numbers, and hyphens' })
    slug?: string;

    @ApiPropertyOptional({ description: 'Custom domain for the checkout', maxLength: 255 })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    @Matches(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: 'Invalid domain format' })
    customDomain?: string;

    @ApiProperty({ description: 'Array of product IDs to include in checkout' })
    @IsArray()
    @IsString({ each: true })
    products: string[];

    @ApiProperty({ description: 'Type of checkout', enum: CheckoutType })
    @IsEnum(CheckoutType)
    checkoutType: CheckoutType;

    @ApiProperty({ description: 'Checkout customizations' })
    @IsObject()
    customizations: {
        showProductImages: boolean;
        showProductDescriptions: boolean;
        allowQuantitySelection: boolean;
        showMerchantInfo: boolean;
        customMessage?: string;
        successRedirectUrl?: string;
        failureRedirectUrl?: string;
    };

    @ApiPropertyOptional({ description: 'Whether the checkout is active', default: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateCheckoutConfigDto {
    @ApiPropertyOptional({ description: 'Checkout configuration name', maxLength: 150 })
    @IsOptional()
    @IsString()
    @MaxLength(150)
    name?: string;

    @ApiPropertyOptional({ description: 'Checkout configuration description', maxLength: 500 })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiPropertyOptional({ description: 'Unique slug for the checkout URL', maxLength: 100 })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    @Matches(/^[a-z0-9-]+$/, { message: 'Slug must contain only lowercase letters, numbers, and hyphens' })
    slug?: string;

    @ApiPropertyOptional({ description: 'Custom domain for the checkout', maxLength: 255 })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    @Matches(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: 'Invalid domain format' })
    customDomain?: string;

    @ApiPropertyOptional({ description: 'Array of product IDs to include in checkout' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    products?: string[];

    @ApiPropertyOptional({ description: 'Type of checkout', enum: CheckoutType })
    @IsOptional()
    @IsEnum(CheckoutType)
    checkoutType?: CheckoutType;

    @ApiPropertyOptional({ description: 'Checkout customizations' })
    @IsOptional()
    @IsObject()
    customizations?: {
        showProductImages: boolean;
        showProductDescriptions: boolean;
        allowQuantitySelection: boolean;
        showMerchantInfo: boolean;
        customMessage?: string;
        successRedirectUrl?: string;
        failureRedirectUrl?: string;
    };

    @ApiPropertyOptional({ description: 'Whether the checkout is active' })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
