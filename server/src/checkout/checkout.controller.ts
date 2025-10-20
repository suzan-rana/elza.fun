import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';
import { CreateCheckoutConfigDto, UpdateCheckoutConfigDto } from './dto/checkout-config.dto';
import { JwtAuthGuard } from '../auth/strategies/jwt.strategy';

@ApiTags('checkout')
@Controller('checkout')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CheckoutController {
    constructor(private readonly checkoutService: CheckoutService) { }

    @Post('configs')
    @ApiOperation({ summary: 'Create a new checkout configuration' })
    async create(@Request() req, @Body() createCheckoutConfigDto: CreateCheckoutConfigDto) {
        return this.checkoutService.create(req.user.sub, createCheckoutConfigDto);
    }

    @Get('configs')
    @ApiOperation({ summary: 'Get all checkout configurations for the merchant' })
    async findAll(@Request() req) {
        return this.checkoutService.findAll(req.user.sub);
    }

    @Get('configs/:id')
    @ApiOperation({ summary: 'Get a specific checkout configuration' })
    async findOne(@Request() req, @Param('id') id: string) {
        return this.checkoutService.findOne(req.user.sub, id);
    }

    @Patch('configs/:id')
    @ApiOperation({ summary: 'Update a checkout configuration' })
    async update(
        @Request() req,
        @Param('id') id: string,
        @Body() updateCheckoutConfigDto: UpdateCheckoutConfigDto
    ) {
        return this.checkoutService.update(req.user.sub, id, updateCheckoutConfigDto);
    }

    @Delete('configs/:id')
    @ApiOperation({ summary: 'Delete a checkout configuration' })
    async remove(@Request() req, @Param('id') id: string) {
        await this.checkoutService.remove(req.user.sub, id);
        return { message: 'Checkout configuration deleted successfully' };
    }

    // Public endpoint for checkout pages (no auth required)
    @Get('public/:id')
    @ApiOperation({ summary: 'Get checkout configuration for public checkout page' })
    async getPublicConfig(@Param('id') id: string) {
        return this.checkoutService.findPublicConfig(id);
    }
}
