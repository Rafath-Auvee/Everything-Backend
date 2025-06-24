import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { GscModule } from '../gsc/gsc.module';

@Module({
    imports: [UserModule, GscModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule { }