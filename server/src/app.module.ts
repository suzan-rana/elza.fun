import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MerchantsModule } from './merchants/merchants.module';
import { CustomersModule } from './customers/customers.module';
import { ProductsModule } from './products/products.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ReceiptsModule } from './receipts/receipts.module';
import { EmailModule } from './email/email.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UploadModule } from './upload/upload.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5433'),
            username: process.env.DB_USERNAME || 'elza_user',
            password: process.env.DB_PASSWORD || 'elza_password',
            database: process.env.DB_DATABASE || 'elza_db',
            autoLoadEntities: true,
            synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true' || process.env.NODE_ENV === 'development',
            logging: process.env.TYPEORM_LOGGING === 'true' || process.env.NODE_ENV === 'development',
        }),
        AuthModule,
        MerchantsModule,
        CustomersModule,
        ProductsModule,
        SubscriptionsModule,
        ReceiptsModule,
        EmailModule,
        DashboardModule,
        UploadModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
