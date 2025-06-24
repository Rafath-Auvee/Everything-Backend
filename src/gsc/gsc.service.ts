import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GscToken } from './gsc.schema';
import { google } from 'googleapis';

@Injectable()
export class GscService {
  constructor(
    @InjectModel(GscToken.name) private gscModel: Model<GscToken>,
  ) { }

  async saveOrUpdateTokens(email: string, tokens: any) {
    return this.gscModel.findOneAndUpdate(
      { email },
      {
        email,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiryDate: tokens.expiry_date,
      },
      { upsert: true, new: true },
    );
  }

  // Unified client getter with token refresh logic
  private async getValidOAuth2Client(record: GscToken) {
    const oauth2Client = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_REDIRECT_URI,
    });

    oauth2Client.setCredentials({
      access_token: record.accessToken,
      refresh_token: record.refreshToken,
    });

    // Token expiry check and refresh
    if (record.expiryDate && record.expiryDate < Date.now()) {
      const { credentials } = await oauth2Client.refreshAccessToken();
      await this.gscModel.findOneAndUpdate(
        { email: record.email },
        {
          accessToken: credentials.access_token,
          expiryDate: credentials.expiry_date,
          refreshToken: credentials.refresh_token || record.refreshToken,
        },
        { new: true }
      );
      oauth2Client.setCredentials({
        access_token: credentials.access_token,
        refresh_token: credentials.refresh_token || record.refreshToken,
      });
    }

    return oauth2Client;
  }

  async getVerifiedSites(email: string): Promise<string[]> {
    const record = await this.gscModel.findOne({ email });
    if (!record) throw new NotFoundException('User GSC token not found');

    const oauth2Client = await this.getValidOAuth2Client(record);

    const webmasters = google.webmasters({ version: 'v3', auth: oauth2Client });
    const { data } = await webmasters.sites.list();
    const sites = (data.siteEntry || [])
      .map((site) => site.siteUrl)
      .filter((url): url is string => typeof url === 'string');

    return sites;
  }

  async saveSelectedSite(email: string, siteUrl: string) {


    const verifiedSites = await this.getVerifiedSites(email);
    if (!verifiedSites.includes(siteUrl)) {
      throw new BadRequestException('Site is not verified for this user');
    }

    const updated = await this.gscModel.findOneAndUpdate(
      { email },
      { selectedSite: siteUrl },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('User not found');
    }

    return updated;
  }

  async getSearchAnalytics(email: string) {
    const record = await this.gscModel.findOne({ email });
    if (!record || !record.selectedSite) {
      throw new NotFoundException('No selected site for user');
    }

    const oauth2Client = await this.getValidOAuth2Client(record);

    const webmasters = google.webmasters({ version: 'v3', auth: oauth2Client });

    const request = {
      siteUrl: record.selectedSite,
      requestBody: {
        startDate: this.getPastDate(7),
        endDate: this.getTodayDate(),
        dimensions: ['date'],
      },
    };

    const { data } = await webmasters.searchanalytics.query(request);
    return data;
  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getPastDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }
}
