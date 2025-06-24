"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GscService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const gsc_schema_1 = require("./gsc.schema");
const googleapis_1 = require("googleapis");
let GscService = class GscService {
    gscModel;
    constructor(gscModel) {
        this.gscModel = gscModel;
    }
    async saveOrUpdateTokens(email, tokens) {
        return this.gscModel.findOneAndUpdate({ email }, {
            email,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            expiryDate: tokens.expiry_date,
        }, { upsert: true, new: true });
    }
    async getValidOAuth2Client(record) {
        const oauth2Client = new googleapis_1.google.auth.OAuth2({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            redirectUri: process.env.GOOGLE_REDIRECT_URI,
        });
        oauth2Client.setCredentials({
            access_token: record.accessToken,
            refresh_token: record.refreshToken,
        });
        if (record.expiryDate && record.expiryDate < Date.now()) {
            const { credentials } = await oauth2Client.refreshAccessToken();
            await this.gscModel.findOneAndUpdate({ email: record.email }, {
                accessToken: credentials.access_token,
                expiryDate: credentials.expiry_date,
                refreshToken: credentials.refresh_token || record.refreshToken,
            }, { new: true });
            oauth2Client.setCredentials({
                access_token: credentials.access_token,
                refresh_token: credentials.refresh_token || record.refreshToken,
            });
        }
        return oauth2Client;
    }
    async getVerifiedSites(email) {
        const record = await this.gscModel.findOne({ email });
        if (!record)
            throw new common_1.NotFoundException('User GSC token not found');
        const oauth2Client = await this.getValidOAuth2Client(record);
        const webmasters = googleapis_1.google.webmasters({ version: 'v3', auth: oauth2Client });
        const { data } = await webmasters.sites.list();
        const sites = (data.siteEntry || [])
            .map((site) => site.siteUrl)
            .filter((url) => typeof url === 'string');
        return sites;
    }
    async saveSelectedSite(email, siteUrl) {
        const verifiedSites = await this.getVerifiedSites(email);
        if (!verifiedSites.includes(siteUrl)) {
            throw new common_1.BadRequestException('Site is not verified for this user');
        }
        const updated = await this.gscModel.findOneAndUpdate({ email }, { selectedSite: siteUrl }, { new: true });
        if (!updated) {
            throw new common_1.NotFoundException('User not found');
        }
        return updated;
    }
    async getSearchAnalytics(email) {
        const record = await this.gscModel.findOne({ email });
        if (!record || !record.selectedSite) {
            throw new common_1.NotFoundException('No selected site for user');
        }
        const oauth2Client = await this.getValidOAuth2Client(record);
        const webmasters = googleapis_1.google.webmasters({ version: 'v3', auth: oauth2Client });
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
    getTodayDate() {
        return new Date().toISOString().split('T')[0];
    }
    getPastDate(days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date.toISOString().split('T')[0];
    }
};
exports.GscService = GscService;
exports.GscService = GscService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(gsc_schema_1.GscToken.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], GscService);
//# sourceMappingURL=gsc.service.js.map