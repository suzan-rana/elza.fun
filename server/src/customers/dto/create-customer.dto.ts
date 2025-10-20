import { IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
    @ApiProperty({ description: 'Wallet address of the customer' })
    @IsString()
    walletAddress: string;

    @ApiProperty({ description: 'Email address of the customer' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'First name', required: false })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({ description: 'Last name', required: false })
    @IsOptional()
    @IsString()
    lastName?: string;
}
