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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const google_oauth_config_1 = require("./google-oauth.config");
const googleapis_1 = require("googleapis");
const user_service_1 = require("../user/user.service");
const gsc_service_1 = require("../gsc/gsc.service");
let AuthService = class AuthService {
    userService;
    gscService;
    constructor(userService, gscService) {
        this.userService = userService;
        this.gscService = gscService;
    }
    getAuthURL() {
        return (0, google_oauth_config_1.getAuthUrl)();
    }
    async handleGoogleCallback(code) {
        const tokens = await (0, google_oauth_config_1.getTokensFromCode)(code);
        console.log("🔑 Received tokens from Google:", tokens);
        if (!tokens.access_token) {
            throw new Error('Failed to retrieve access token from Google');
        }
        const oauth2Client = new googleapis_1.google.auth.OAuth2({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            redirectUri: process.env.GOOGLE_REDIRECT_URI,
        });
        oauth2Client.setCredentials(tokens);
        console.log("📦 Final Access Token set:", oauth2Client.credentials.access_token);
        const oauth2 = googleapis_1.google.oauth2({
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        gsc_service_1.GscService])
], AuthService);
//# sourceMappingURL=auth.service.js.map