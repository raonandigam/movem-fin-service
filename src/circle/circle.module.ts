import { Module } from '@nestjs/common';
import { CircleService } from './circle.service';
import { CircleController } from './circle.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsService } from 'src/transactions/transactions.service';
import { Transaction, TransactionSchema } from 'src/transactions/schemas/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
  ],
  providers: [CircleService, TransactionsService],
  controllers: [CircleController],
})
export class CircleModule {}
