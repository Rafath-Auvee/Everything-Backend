import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('google')
    async redirectToGoogle(@Res() res: Response) {
        const url = this.authService.getAuthURL();
        return res.redirect(url);
    }

    @Get('google/callback')
    async handleGoogleCallback(@Query('code') code: string) {
        const result = await this.authService.handleGoogleCallback(code);
        return {
            message: 'Google OAuth successful',
            data: result,
        };
    }
}
