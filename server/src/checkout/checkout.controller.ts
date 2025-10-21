import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';
import { CreateCheckoutConfigDto, UpdateCheckoutConfigDto } from './dto/checkout-config.dto';
import { JwtAuthGuard } from '../auth/strategies/jwt.strategy';

@ApiTags('checkout')
@Controller('checkout')
export class CheckoutController {
    constructor(private readonly checkoutService: CheckoutService) { }

    @Post('configs')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new checkout configuration' })
    async create(@Request() req, @Body() createCheckoutConfigDto: CreateCheckoutConfigDto) {
        return this.checkoutService.create(req.user.sub, createCheckoutConfigDto);
    }

    @Get('configs')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all checkout configurations for the merchant' })
    async findAll(@Request() req) {
        return this.checkoutService.findAll(req.user.sub);
    }

    @Get('configs/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a specific checkout configuration' })
    async findOne(@Request() req, @Param('id') id: string) {
        return this.checkoutService.findOne(req.user.sub, id);
    }

    @Patch('configs/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a checkout configuration' })
    async update(
        @Request() req,
        @Param('id') id: string,
        @Body() updateCheckoutConfigDto: UpdateCheckoutConfigDto
    ) {
        return this.checkoutService.update(req.user.sub, id, updateCheckoutConfigDto);
    }

    @Delete('configs/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a checkout configuration' })
    async remove(@Request() req, @Param('id') id: string) {
        await this.checkoutService.remove(req.user.sub, id);
        return { message: 'Checkout configuration deleted successfully' };
    }

    // Public endpoint for checkout pages (no auth required)
    @Get('public/:id')
    @ApiOperation({ summary: 'Get checkout configuration for public checkout page by ID' })
    async getPublicConfig(@Param('id') id: string) {
        return this.checkoutService.findPublicConfig(id);
    }

    // Public endpoint for checkout pages by slug (no auth required)
    @Get('public/slug/:slug')
    @ApiOperation({ summary: 'Get checkout configuration for public checkout page by slug' })
    async getPublicConfigBySlug(@Param('slug') slug: string) {
        return this.checkoutService.findPublicConfigBySlug(slug);
    }

    // Public endpoint for checkout pages by custom domain (no auth required)
    @Get('public/domain/:domain')
    @ApiOperation({ summary: 'Get checkout configuration for public checkout page by custom domain' })
    async getPublicConfigByDomain(@Param('domain') domain: string) {
        return this.checkoutService.findPublicConfigByDomain(domain);
    }

    // Check slug availability
    @Get('configs/slug/available/:slug')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Check if a slug is available' })
    async checkSlugAvailability(@Request() req, @Param('slug') slug: string) {
        const isAvailable = await this.checkoutService.isSlugAvailable(slug);
        return { available: isAvailable };
    }
}
