import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/strategies/jwt.strategy';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('stats')
    @ApiOperation({ summary: 'Get dashboard statistics' })
    async getStats(@Request() req) {
        return this.dashboardService.getDashboardStats(req.user.sub);
    }

    @Get('products')
    @ApiOperation({ summary: 'Get recent products' })
    async getProducts(@Request() req) {
        return this.dashboardService.getProducts(req.user.sub);
    }

    @Get('transactions')
    @ApiOperation({ summary: 'Get recent transactions' })
    async getTransactions(@Request() req) {
        return this.dashboardService.getTransactions(req.user.sub);
    }
}
