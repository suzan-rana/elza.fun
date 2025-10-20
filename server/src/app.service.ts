import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Elza Solana Platform API is running! 🚀';
    }

    getHealth() {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'elza-platform-api',
            version: '1.0.0',
        };
    }
}
