import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards, Request, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { UploadService } from '../upload/upload.service';
import { JwtAuthGuard } from '../auth/strategies/jwt.strategy';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly uploadService: UploadService,
    ) { }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'imageUrl', maxCount: 1 },
        { name: 'thumbnailUrl', maxCount: 1 },
        { name: 'previewUrl', maxCount: 1 },
        { name: 'downloadUrl', maxCount: 1 },
        { name: 'videoUrl', maxCount: 1 },
    ]))
    @ApiOperation({ summary: 'Create a new product with optional file uploads' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Product data with optional file uploads',
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string', description: 'Product title' },
                slug: { type: 'string', description: 'Product slug' },
                description: { type: 'string', description: 'Product description' },
                product_type: { type: 'string', enum: ['digital_product', 'course', 'ebook', 'membership', 'bundle', 'service', 'subscription'] },
                price: { type: 'number', description: 'Product price' },
                currency: { type: 'string', description: 'Currency code' },
                contentUrl: { type: 'string', description: 'Content URL' },
                isActive: { type: 'boolean', description: 'Whether product is active' },
                subscriptionInterval: { type: 'string', description: 'Subscription interval' },
                subscriptionPrice: { type: 'number', description: 'Subscription price' },
                maxSubscriptions: { type: 'number', description: 'Maximum subscriptions' },
                externalLinks: { type: 'string', description: 'JSON string of external links' },
                gatedContent: { type: 'string', description: 'JSON string of gated content' },
                imageUrl: { type: 'string', format: 'binary', description: 'Main product image' },
                thumbnailUrl: { type: 'string', format: 'binary', description: 'Thumbnail image' },
                previewUrl: { type: 'string', format: 'binary', description: 'Preview image' },
                downloadUrl: { type: 'string', format: 'binary', description: 'Download file' },
                videoUrl: { type: 'string', format: 'binary', description: 'Video file' },
            },
        },
    })
    async create(
        @Request() req,
        @Body() createProductDto: any,
        @UploadedFiles() files: {
            imageUrl?: Express.Multer.File[];
            thumbnailUrl?: Express.Multer.File[];
            previewUrl?: Express.Multer.File[];
            downloadUrl?: Express.Multer.File[];
            videoUrl?: Express.Multer.File[];
        }
    ) {
        try {
            // Handle file uploads
            const uploadPromises = [];
            const fileFields = ['imageUrl', 'thumbnailUrl', 'previewUrl', 'downloadUrl', 'videoUrl'];

            for (const field of fileFields) {
                if (files[field] && files[field][0]) {
                    const file = files[field][0];
                    const folder = `products/${createProductDto.product_type || 'general'}`;
                    const tags = ['product', createProductDto.product_type || 'general'];

                    uploadPromises.push(
                        this.uploadService.uploadImage(file, folder, { tags })
                            .then(result => ({ field, url: result.url, publicId: result.publicId, folder: result.folder }))
                    );
                }
            }

            // Wait for all uploads to complete
            const uploadResults = await Promise.all(uploadPromises);

            // Update DTO with uploaded URLs
            const updatedDto = { ...createProductDto };
            uploadResults.forEach(({ field, url }) => {
                updatedDto[field] = url;
            });

            // Parse JSON fields if they exist
            if (updatedDto.externalLinks && typeof updatedDto.externalLinks === 'string') {
                updatedDto.externalLinks = JSON.parse(updatedDto.externalLinks);
            }
            if (updatedDto.gatedContent && typeof updatedDto.gatedContent === 'string') {
                updatedDto.gatedContent = JSON.parse(updatedDto.gatedContent);
            }

            return this.productsService.create(req.user.sub, updatedDto);
        } catch (error) {
            throw new Error(`Failed to create product: ${error.message}`);
        }
    }

    @Get()
    @ApiOperation({ summary: 'Get all products' })
    findAll(@Request() req) {
        return this.productsService.findByMerchant(req.user.sub);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID' })
    findOne(@Request() req, @Param('id') id: string) {
        return this.productsService.findOne(req.user.sub, id);
    }

    @Put(':id')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'imageUrl', maxCount: 1 },
        { name: 'thumbnailUrl', maxCount: 1 },
        { name: 'previewUrl', maxCount: 1 },
        { name: 'downloadUrl', maxCount: 1 },
        { name: 'videoUrl', maxCount: 1 },
    ]))
    @ApiOperation({ summary: 'Update a product with optional file uploads' })
    @ApiConsumes('multipart/form-data')
    async update(
        @Request() req,
        @Param('id') id: string,
        @Body() updateProductDto: any,
        @UploadedFiles() files: {
            imageUrl?: Express.Multer.File[];
            thumbnailUrl?: Express.Multer.File[];
            previewUrl?: Express.Multer.File[];
            downloadUrl?: Express.Multer.File[];
            videoUrl?: Express.Multer.File[];
        }
    ) {
        try {
            // Handle file uploads
            const uploadPromises = [];
            const fileFields = ['imageUrl', 'thumbnailUrl', 'previewUrl', 'downloadUrl', 'videoUrl'];

            for (const field of fileFields) {
                if (files[field] && files[field][0]) {
                    const file = files[field][0];
                    const folder = `products/${updateProductDto.product_type || 'general'}`;
                    const tags = ['product', updateProductDto.product_type || 'general'];

                    uploadPromises.push(
                        this.uploadService.uploadImage(file, folder, { tags })
                            .then(result => ({ field, url: result.url, publicId: result.publicId, folder: result.folder }))
                    );
                }
            }

            // Wait for all uploads to complete
            const uploadResults = await Promise.all(uploadPromises);

            // Update DTO with uploaded URLs
            const updatedDto = { ...updateProductDto };
            uploadResults.forEach(({ field, url }) => {
                updatedDto[field] = url;
            });

            // Parse JSON fields if they exist
            if (updatedDto.externalLinks && typeof updatedDto.externalLinks === 'string') {
                updatedDto.externalLinks = JSON.parse(updatedDto.externalLinks);
            }
            if (updatedDto.gatedContent && typeof updatedDto.gatedContent === 'string') {
                updatedDto.gatedContent = JSON.parse(updatedDto.gatedContent);
            }

            return this.productsService.update(req.user.sub, id, updatedDto);
        } catch (error) {
            throw new Error(`Failed to update product: ${error.message}`);
        }
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a product (JSON only)' })
    async updateJson(
        @Request() req,
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto
    ) {
        try {
            // Parse JSON fields if they exist
            const updatedDto = { ...updateProductDto };
            if (updatedDto.externalLinks && typeof updatedDto.externalLinks === 'string') {
                updatedDto.externalLinks = JSON.parse(updatedDto.externalLinks);
            }
            if (updatedDto.gatedContent && typeof updatedDto.gatedContent === 'string') {
                updatedDto.gatedContent = JSON.parse(updatedDto.gatedContent);
            }

            return this.productsService.update(req.user.sub, id, updatedDto);
        } catch (error) {
            throw new Error(`Failed to update product: ${error.message}`);
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a product' })
    remove(@Request() req, @Param('id') id: string) {
        return this.productsService.remove(req.user.sub, id);
    }
}
