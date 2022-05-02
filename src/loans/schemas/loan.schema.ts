import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type LoanDocument = Loan;

@Schema()
export class Loan extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  borrower: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  lender: User;

  @Prop()
  collateral: string;

  @Prop()
  amount: number;

  @Prop()
  tenor: number;

  @Prop()
  rate: number;

  @Prop({ default: true })
  is_pending: boolean;
}

export const LoanSchema = SchemaFactory.createForClass(Loan);
