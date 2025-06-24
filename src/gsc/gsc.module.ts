import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GscToken, GscTokenSchema } from './gsc.schema';
import { GscService } from './gsc.service';
import { GscController } from './gsc.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GscToken.name, schema: GscTokenSchema }]),
  ],
  controllers: [GscController],
  providers: [GscService],
})
export class GscModule {}
