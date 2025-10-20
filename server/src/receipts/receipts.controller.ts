import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReceiptsService } from './receipts.service';

@ApiTags('Receipts')
@Controller('receipts')
export class ReceiptsController {
    constructor(private readonly receiptsService: ReceiptsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new receipt' })
    create(@Body() createReceiptDto: any) {
        return this.receiptsService.create(createReceiptDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all receipts' })
    findAll() {
        return this.receiptsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get receipt by ID' })
    findOne(@Param('id') id: string) {
        return this.receiptsService.findOne(id);
    }
}
