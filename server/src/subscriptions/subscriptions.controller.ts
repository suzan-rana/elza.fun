import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new subscription' })
    create(@Body() createSubscriptionDto: any) {
        return this.subscriptionsService.create(createSubscriptionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all subscriptions' })
    findAll() {
        return this.subscriptionsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get subscription by ID' })
    findOne(@Param('id') id: string) {
        return this.subscriptionsService.findOne(id);
    }
}
