import { UserService } from '../user/user.service';
import { GscService } from 'src/gsc/gsc.service';
export declare class AuthService {
    private readonly userService;
    private readonly gscService;
    constructor(userService: UserService, gscService: GscService);
    getAuthURL(): string;
    handleGoogleCallback(code: string): Promise<{
        email: string;
        tokens: import("google-auth-library").Credentials;
    }>;
}
