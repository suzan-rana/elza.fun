import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/strategies/jwt.strategy';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new product' })
    create(@Request() req, @Body() createProductDto: any) {
        return this.productsService.create(req.user.sub, createProductDto);
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
}
