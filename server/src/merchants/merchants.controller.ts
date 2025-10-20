import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MerchantsService } from './merchants.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { JwtAuthGuard } from '../auth/strategies/jwt.strategy';

@ApiTags('Merchants')
@Controller('merchants')
export class MerchantsController {
    constructor(private readonly merchantsService: MerchantsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new merchant' })
    create(@Body() createMerchantDto: CreateMerchantDto) {
        return this.merchantsService.create(createMerchantDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all merchants' })
    findAll() {
        return this.merchantsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get merchant by ID' })
    findOne(@Param('id') id: string) {
        return this.merchantsService.findOne(id);
    }

    @Get('wallet/:walletAddress')
    @ApiOperation({ summary: 'Get merchant by wallet address' })
    findByWalletAddress(@Param('walletAddress') walletAddress: string) {
        return this.merchantsService.findByWalletAddress(walletAddress);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update current user merchant information' })
    updateCurrentMerchant(@Request() req, @Body() updateMerchantDto: UpdateMerchantDto) {
        return this.merchantsService.update(req.user.sub, updateMerchantDto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update merchant by ID' })
    update(@Param('id') id: string, @Body() updateMerchantDto: UpdateMerchantDto) {
        return this.merchantsService.update(id, updateMerchantDto);
    }
}
