import { AuthService } from './auth.service';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    redirectToGoogle(res: Response): Promise<void>;
    googleCallback(code: string, res: Response): Promise<void>;
}
