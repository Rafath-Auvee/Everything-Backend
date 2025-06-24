import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/url')
  getGoogleUrl() {
    const url = this.authService.getAuthURL();
    return { url };
  }

  @Get('google/callback')
  async googleCallback(@Query('code') code: string, @Res() res: Response) {
    const tokens = await this.authService.handleGoogleCallback(code);
    console.log('Received Tokens:', tokens);
    return res.redirect('http://localhost:3000/dashboard');
  }
}