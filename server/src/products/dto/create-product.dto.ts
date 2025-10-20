import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum, IsArray, ValidateNested, IsUrl, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductType } from '../entities/product.entity';

export class ExternalLinkDto {
    @ApiProperty({ description: 'Unique identifier for the link' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'Title of the external link' })
    @IsString()
    @MaxLength(100)
    title: string;

    @ApiProperty({ description: 'Type of link', enum: ['link', 'text'] })
    @IsEnum(['link', 'text'])
    type: 'link' | 'text';

    @ApiProperty({ description: 'URL for links or text content for text' })
    @IsString()
    content: string;

    @ApiPropertyOptional({ description: 'Description of the link' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;
}

export class GatedContentDto {
    @ApiProperty({ description: 'Unique identifier for the content' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'Title of the gated content' })
    @IsString()
    @MaxLength(100)
    title: string;

    @ApiProperty({ description: 'Type of content', enum: ['file', 'text', 'video', 'link'] })
    @IsEnum(['file', 'text', 'video', 'link'])
    type: 'file' | 'text' | 'video' | 'link';

    @ApiProperty({ description: 'Content URL or text content' })
    @IsString()
    content: string;

    @ApiPropertyOptional({ description: 'Description of the content' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiPropertyOptional({ description: 'Additional metadata for the content' })
    @IsOptional()
    metadata?: any;
}

export class CreateProductDto {
    @ApiProperty({ description: 'Product title', maxLength: 150 })
    @IsString()
    @MaxLength(150)
    title: string;

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

    @ApiProperty({ description: 'Product type', enum: ProductType })
    @IsEnum(ProductType)
    product_type: ProductType;

    @ApiProperty({ description: 'Product price' })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ description: 'Currency code', example: 'USDC' })
    @IsString()
    currency: string;

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

    @ApiPropertyOptional({ description: 'Whether the product is active', default: true })
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

    @ApiPropertyOptional({ description: 'External links', type: [ExternalLinkDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExternalLinkDto)
    externalLinks?: ExternalLinkDto[];

    @ApiPropertyOptional({ description: 'Gated content', type: [GatedContentDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GatedContentDto)
    gatedContent?: GatedContentDto[];
}
