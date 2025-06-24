import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class GscToken extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  accessToken: string;

  @Prop()
  refreshToken: string;

  @Prop()
  expiryDate: number;

  @Prop()
  selectedSite?: string;
}

export const GscTokenSchema = SchemaFactory.createForClass(GscToken);
