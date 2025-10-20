import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get()
    @ApiOperation({ summary: 'Health check endpoint' })
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('health')
    @ApiOperation({ summary: 'Detailed health check' })
    getHealth() {
        return this.appService.getHealth();
    }

    @Get('test-jwt')
    @ApiOperation({ summary: 'Test JWT configuration' })
    testJwt() {
        return {
            jwtSecret: process.env.JWT_SECRET ? 'Set' : 'Not set',
            nodeEnv: process.env.NODE_ENV,
            apiPort: process.env.API_PORT
        };
    }

    @Post('test-product')
    @ApiOperation({ summary: 'Test product creation' })
    async testProduct(@Body() createProductDto: any) {
        // Import ProductsService dynamically to avoid circular dependency
        const { ProductsService } = await import('./products/products.service');
        const { Product } = await import('./products/entities/product.entity');
        const { getRepositoryToken } = await import('@nestjs/typeorm');

        // This is a simplified test - in real implementation, you'd inject the service properly
        return { message: 'Product creation test endpoint', data: createProductDto };
    }
}
