import { User } from './user.schema';
import { Model } from 'mongoose';
export declare class UserService {
    private userModel;
    constructor(userModel: Model<User>);
    saveOrUpdateUser(email: string, tokens: any): Promise<import("mongoose").Document<unknown, {}, User, {}> & User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findByEmail(email: string): Promise<(import("mongoose").Document<unknown, {}, User, {}> & User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
