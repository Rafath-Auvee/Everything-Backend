import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class GscToken extends Document {
  @Prop({ required: true })
  email: string;

  @Prop()
  accessToken: string;

  @Prop()
  refreshToken: string;

  @Prop()
  expiryDate: number;

  @Prop()
  selectedSite: string;
}

export const GscTokenSchema = SchemaFactory.createForClass(GscToken);