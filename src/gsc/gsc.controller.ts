import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { GscService } from './gsc.service';

@Controller('gsc')
export class GscController {
    constructor(private readonly gscService: GscService) { }

    @Get('sites')
    async getVerifiedSites(@Query('email') email: string) {
        const sites = await this.gscService.getVerifiedSites(email);
        return { email, sites };
    }

    @Post('sites/select')
    async selectSite(@Body() body: { email: string; siteUrl: string }) {
        const updated = await this.gscService.saveSelectedSite(body.email, body.siteUrl);
        if (!updated) {
            return { message: 'No user found or site not saved' };
        }
        return { message: 'Site selected', selectedSite: updated.selectedSite };
    }

    @Get('analytics')
    async getSearchAnalytics(@Query('email') email: string) {
        const analytics = await this.gscService.getSearchAnalytics(email);
        return { email, analytics };
    }
}
