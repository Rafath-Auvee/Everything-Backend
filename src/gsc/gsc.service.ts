import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GscToken } from './gsc.schema';
import { google } from 'googleapis';
import oauth2Client, { setOAuthCredentials } from '../auth/google-oauth.config';

@Injectable()
export class GscService {
  constructor(
    @InjectModel(GscToken.name) private gscModel: Model<GscToken>,
  ) {}

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

  async getVerifiedSites(email: string): Promise<string[]> {
    const record = await this.gscModel.findOne({ email });
    if (!record) throw new NotFoundException('User GSC token not found');

    setOAuthCredentials({
      access_token: record.accessToken,
      refresh_token: record.refreshToken,
    });

    const webmasters = google.webmasters({ version: 'v3', auth: oauth2Client });
    const { data } = await webmasters.sites.list();
    const sites = (data.siteEntry || [])
      .map((site) => site.siteUrl)
      .filter((url): url is string => typeof url === 'string');

    return sites;
  }

  async saveSelectedSite(email: string, siteUrl: string) {
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

    setOAuthCredentials({
      access_token: record.accessToken,
      refresh_token: record.refreshToken,
    });

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
