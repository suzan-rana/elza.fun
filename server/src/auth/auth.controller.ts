import { Controller, Post, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './strategies/jwt.strategy';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('wallet')
    @ApiOperation({ summary: 'Authenticate with wallet signature' })
    async authenticateWithWallet(@Body() body: { walletAddress: string; signature: string }) {
        return this.authService.authenticateWithWallet(body.walletAddress, body.signature);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user profile' })
    async getProfile(@Request() req) {
        return this.authService.getProfile(req.user.sub);
    }

    @Put('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user profile' })
    async updateProfile(@Request() req, @Body() updateData: any) {
        return this.authService.updateProfile(req.user.sub, updateData);
    }
}
