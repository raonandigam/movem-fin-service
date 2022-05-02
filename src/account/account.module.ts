import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockchainModule } from 'src/blockchain/blockchain.module';
import { CircleModule } from 'src/circle/circle.module';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { CircleService } from 'src/circle/circle.service';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { UsersService } from 'src/users/users.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { Transaction, TransactionSchema } from 'src/transactions/schemas/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    BlockchainModule,
    CircleModule,
  ],
  providers: [AccountService, CircleService, BlockchainService, UsersService,TransactionsService],
  controllers: [AccountController]
})
export class AccountModule {}
