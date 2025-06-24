import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async saveOrUpdateUser(email: string, tokens: any) {
        return this.userModel.findOneAndUpdate(
            { email },
            {
                email,
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
            },
            { upsert: true, new: true }
        );
    }

    async findByEmail(email: string) {
        return this.userModel.findOne({ email });
    }
}