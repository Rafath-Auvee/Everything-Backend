import { GscService } from './gsc.service';
export declare class GscController {
    private readonly gscService;
    constructor(gscService: GscService);
    getVerifiedSites(email: string): Promise<{
        email: string;
        sites: string[];
    }>;
    selectSite(body: {
        email: string;
        siteUrl: string;
    }): Promise<{
        message: string;
        selectedSite?: undefined;
    } | {
        message: string;
        selectedSite: string | undefined;
    }>;
    getSearchAnalytics(email: string): Promise<{
        email: string;
        analytics: import("googleapis").webmasters_v3.Schema$SearchAnalyticsQueryResponse;
    }>;
}
