import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EmailService } from './email.service';

@ApiTags('Email')
@Controller('email')
export class EmailController {
    constructor(private readonly emailService: EmailService) { }

    @Post('send')
    @ApiOperation({ summary: 'Send email' })
    sendEmail(@Body() emailData: any) {
        return this.emailService.sendEmail(emailData);
    }

    @Get('lists')
    @ApiOperation({ summary: 'Get email lists' })
    getEmailLists() {
        return this.emailService.getEmailLists();
    }
}
