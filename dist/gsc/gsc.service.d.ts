import { Model } from 'mongoose';
import { GscToken } from './gsc.schema';
export declare class GscService {
    private gscModel;
    constructor(gscModel: Model<GscToken>);
    saveOrUpdateTokens(email: string, tokens: any): Promise<import("mongoose").Document<unknown, {}, GscToken, {}> & GscToken & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    private getValidOAuth2Client;
    getVerifiedSites(email: string): Promise<string[]>;
    saveSelectedSite(email: string, siteUrl: string): Promise<import("mongoose").Document<unknown, {}, GscToken, {}> & GscToken & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getSearchAnalytics(email: string): Promise<import("googleapis").webmasters_v3.Schema$SearchAnalyticsQueryResponse>;
    private getTodayDate;
    private getPastDate;
}
