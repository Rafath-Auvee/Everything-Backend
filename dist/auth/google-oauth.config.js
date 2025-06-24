"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokensFromCode = exports.getAuthUrl = exports.GSC_SCOPES = void 0;
const googleapis_1 = require("googleapis");
const dotenv = require("dotenv");
dotenv.config();
const oauth2Client = new googleapis_1.google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
});
exports.GSC_SCOPES = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/webmasters.readonly'
];
const getAuthUrl = () => {
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: exports.GSC_SCOPES,
        prompt: 'consent',
    });
};
exports.getAuthUrl = getAuthUrl;
const getTokensFromCode = async (code) => {
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
};
exports.getTokensFromCode = getTokensFromCode;
//# sourceMappingURL=google-oauth.config.js.map