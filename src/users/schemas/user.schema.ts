import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DidKey } from 'verite';

// export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  wallet_address: string;
  
  @Prop()
  circle_wallet: number;

  @Prop({ required: true })
  password_hash: string;

  @Prop()
  privateKey: string;

  @Prop()
  publicKey: string;


  @Prop()
  verite_token: string;

  @Prop()
  subject_id: string;

  @Prop()
  issuer_id: string;

  @Prop()
  verification_id: string;

  @Prop()
  kyc: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
// UserSchema.index({ wallet_address: 1 }, { unique: true });
