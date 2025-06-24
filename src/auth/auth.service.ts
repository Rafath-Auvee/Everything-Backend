import { Injectable } from '@nestjs/common';
import { getGoogleAuthURL, getTokensFromCode, oauth2Client } from './google-oauth.config';
import { UserService } from '../user/user.service';
import { google } from 'googleapis';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  getAuthURL(): string {
    return getGoogleAuthURL();
  }

  async handleGoogleCallback(code: string) {
    const tokens = await getTokensFromCode(code);

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2('v2');
    const userInfo = await oauth2.userinfo.get({ auth: oauth2Client });
    const email = userInfo.data.email;

    if (!email) {
      throw new Error('Unable to fetch user email from Google');
    }

    await this.userService.saveOrUpdateUser(email, tokens);

    return { email, tokens };
  }
}
