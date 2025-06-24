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
    async googleCallback(@Query('code') code: string, @Res() res: Response) {
        console.log('🔁 Received code from Google:', code);
        const result = await this.authService.handleGoogleCallback(code);
        const email = result.email;
        return res.redirect(`${process.env.FRONTEND_URL}/?email=${email}`);
    }
}
