import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Loan, LoanSchema } from './schemas/loan.schema';
import { UsersService } from '../users/users.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { BlockchainService } from '../blockchain/blockchain.service';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { CircleModule } from 'src/circle/circle.module';
import { CircleService } from 'src/circle/circle.service';
import { Transaction, TransactionSchema } from 'src/transactions/schemas/transaction.schema';
import { TransactionsService } from 'src/transactions/transactions.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Loan.name, schema: LoanSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    BlockchainModule,
    CircleModule,
  ],
  controllers: [LoansController],
  providers: [LoansService, UsersService, BlockchainService, CircleService, TransactionsService],
})
export class LoansModule {}
