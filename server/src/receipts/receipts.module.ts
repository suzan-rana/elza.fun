import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptsController } from './receipts.controller';
import { ReceiptsService } from './receipts.service';
import { Receipt } from './entities/receipt.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Receipt])],
    controllers: [ReceiptsController],
    providers: [ReceiptsService],
    exports: [ReceiptsService],
})
export class ReceiptsModule { }
