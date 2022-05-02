import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type TransactionDocument = Transaction;

@Schema()
export class Transaction extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' })
  user: User;

  @Prop()
  transactionId: string;
  
  @Prop()
  type: string;  // Can be NEWRL, CIRCLE
  
  @Prop()
  description: string;
  
  @Prop()
  status: string;

  @Prop()
  amount: number;

  @Prop()
  currency: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
