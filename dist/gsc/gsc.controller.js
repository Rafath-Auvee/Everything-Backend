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
exports.GscController = void 0;
const common_1 = require("@nestjs/common");
const gsc_service_1 = require("./gsc.service");
let GscController = class GscController {
    gscService;
    constructor(gscService) {
        this.gscService = gscService;
    }
    async getVerifiedSites(email) {
        const sites = await this.gscService.getVerifiedSites(email);
        return { email, sites };
    }
    async selectSite(body) {
        const updated = await this.gscService.saveSelectedSite(body.email, body.siteUrl);
        if (!updated) {
            return { message: 'No user found or site not saved' };
        }
        return { message: 'Site selected', selectedSite: updated.selectedSite };
    }
    async getSearchAnalytics(email) {
        const analytics = await this.gscService.getSearchAnalytics(email);
        return { email, analytics };
    }
};
exports.GscController = GscController;
__decorate([
    (0, common_1.Get)('sites'),
    __param(0, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GscController.prototype, "getVerifiedSites", null);
__decorate([
    (0, common_1.Post)('sites/select'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GscController.prototype, "selectSite", null);
__decorate([
    (0, common_1.Get)('analytics'),
    __param(0, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GscController.prototype, "getSearchAnalytics", null);
exports.GscController = GscController = __decorate([
    (0, common_1.Controller)('gsc'),
    __metadata("design:paramtypes", [gsc_service_1.GscService])
], GscController);
//# sourceMappingURL=gsc.controller.js.map