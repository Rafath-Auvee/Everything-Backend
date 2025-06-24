import { Injectable } from '@nestjs/common';
import { getAuthUrl, getTokensFromCode, setOAuthCredentials, default as oauth2Client } from './google-oauth.config';
import { google } from 'googleapis';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  getAuthURL(): string {
    return getAuthUrl();
  }

  async handleGoogleCallback(code: string) {
    const tokens = await getTokensFromCode(code);
    setOAuthCredentials(tokens); 
    
    const oauth2 = google.oauth2({
      version: 'v2',
      auth: oauth2Client,
    });

    const { data: userInfo } = await oauth2.userinfo.get();

    const email = userInfo.email;

    if (!email) {
      throw new Error('Unable to fetch user email from Google');
    }

    // Store user and tokens in DB
    await this.userService.saveOrUpdateUser(email, tokens);

    return { email, tokens };
  }
}
