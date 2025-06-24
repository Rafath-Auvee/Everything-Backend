import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUser(email: string): Promise<(import("mongoose").Document<unknown, {}, import("./user.schema").User, {}> & import("./user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
