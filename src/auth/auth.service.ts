import { Injectable } from '@nestjs/common';
import { getAuthUrl, getTokensFromCode } from './google-oauth.config';
import { google } from 'googleapis';
import { UserService } from '../user/user.service';
import { GscService } from 'src/gsc/gsc.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly gscService: GscService,
  ) { }

  getAuthURL(): string {
    return getAuthUrl();
  }

  async handleGoogleCallback(code: string) {
    const tokens = await getTokensFromCode(code);

    console.log("🔑 Received tokens from Google:", tokens);

    if (!tokens.access_token) {
      throw new Error('Failed to retrieve access token from Google');
    }

    const oauth2Client = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_REDIRECT_URI,
    });

    oauth2Client.setCredentials(tokens);

    console.log("📦 Final Access Token set:", oauth2Client.credentials.access_token);

    const oauth2 = google.oauth2({
      version: 'v2',
      auth: oauth2Client,
    });

    const { data: userInfo } = await oauth2.userinfo.get();

    console.log("Access Token:", oauth2Client.credentials.access_token);

    const email = userInfo.email;
    if (!email) {
      throw new Error('Unable to fetch user email from Google');
    }

    await this.userService.saveOrUpdateUser(email, tokens);
    await this.gscService.saveOrUpdateTokens(email, tokens);

    return { email, tokens };
  }
}
