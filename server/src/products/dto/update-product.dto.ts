import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum, IsArray, ValidateNested, IsUrl, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductType } from '../entities/product.entity';

export class UpdateExternalLinkDto {
    @ApiPropertyOptional({ description: 'Unique identifier for the link' })
    @IsOptional()
    @IsString()
    id?: string;

    @ApiPropertyOptional({ description: 'Title of the external link' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    title?: string;

    @ApiPropertyOptional({ description: 'Type of link', enum: ['link', 'text'] })
    @IsOptional()
    @IsEnum(['link', 'text'])
    type?: 'link' | 'text';

    @ApiPropertyOptional({ description: 'URL for links or text content for text' })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiPropertyOptional({ description: 'Description of the link' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;
}

export class UpdateGatedContentDto {
    @ApiPropertyOptional({ description: 'Unique identifier for the content' })
    @IsOptional()
    @IsString()
    id?: string;

    @ApiPropertyOptional({ description: 'Title of the gated content' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    title?: string;

    @ApiPropertyOptional({ description: 'Type of content', enum: ['file', 'text', 'video', 'link'] })
    @IsOptional()
    @IsEnum(['file', 'text', 'video', 'link'])
    type?: 'file' | 'text' | 'video' | 'link';

    @ApiPropertyOptional({ description: 'Content URL or text content' })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiPropertyOptional({ description: 'Description of the content' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiPropertyOptional({ description: 'Additional metadata for the content' })
    @IsOptional()
    metadata?: any;
}

export class UpdateProductDto {
    @ApiPropertyOptional({ description: 'Product title', maxLength: 150 })
    @IsOptional()
    @IsString()
    @MaxLength(150)
    title?: string;

    @ApiPropertyOptional({ description: 'Product slug', maxLength: 100 })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    slug?: string;

    @ApiPropertyOptional({ description: 'Product description', maxLength: 2000 })
    @IsOptional()
    @IsString()
    @MaxLength(2000)
    description?: string;

    @ApiPropertyOptional({ description: 'Product type', enum: ProductType })
    @IsOptional()
    @IsEnum(ProductType)
    product_type?: ProductType;

    @ApiPropertyOptional({ description: 'Product price' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @ApiPropertyOptional({ description: 'Currency code', example: 'USDC' })
    @IsOptional()
    @IsString()
    currency?: string;

    @ApiPropertyOptional({ description: 'Main product image URL' })
    @IsOptional()
    @IsUrl()
    imageUrl?: string;

    @ApiPropertyOptional({ description: 'Thumbnail image URL' })
    @IsOptional()
    @IsUrl()
    thumbnailUrl?: string;

    @ApiPropertyOptional({ description: 'Preview image URL' })
    @IsOptional()
    @IsUrl()
    previewUrl?: string;

    @ApiPropertyOptional({ description: 'Download URL' })
    @IsOptional()
    @IsUrl()
    downloadUrl?: string;

    @ApiPropertyOptional({ description: 'Video URL' })
    @IsOptional()
    @IsUrl()
    videoUrl?: string;

    @ApiPropertyOptional({ description: 'Content URL' })
    @IsOptional()
    @IsUrl()
    contentUrl?: string;

    @ApiPropertyOptional({ description: 'Whether the product is active' })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({ description: 'Subscription interval', example: 'monthly' })
    @IsOptional()
    @IsString()
    subscriptionInterval?: string;

    @ApiPropertyOptional({ description: 'Subscription price' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    subscriptionPrice?: number;

    @ApiPropertyOptional({ description: 'Maximum number of subscriptions' })
    @IsOptional()
    @IsNumber()
    @Min(1)
    maxSubscriptions?: number;

    @ApiPropertyOptional({ description: 'External links', type: [UpdateExternalLinkDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateExternalLinkDto)
    externalLinks?: UpdateExternalLinkDto[];

    @ApiPropertyOptional({ description: 'Gated content', type: [UpdateGatedContentDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateGatedContentDto)
    gatedContent?: UpdateGatedContentDto[];
}
