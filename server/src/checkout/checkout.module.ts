import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { CheckoutConfig } from './entities/checkout-config.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CheckoutConfig])],
    controllers: [CheckoutController],
    providers: [CheckoutService],
    exports: [CheckoutService],
})
export class CheckoutModule { }
