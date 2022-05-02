import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CollateralDocument = Collateral;

@Schema()
export class Collateral extends Document {
  @Prop()
  name: string;

  @Prop()
  token_code: string;

  @Prop()
  quantity: number;

  @Prop()
  value: number;

  @Prop({ default: false })
  is_pledged: boolean;
}

export const CollateralSchema = SchemaFactory.createForClass(Collateral);
