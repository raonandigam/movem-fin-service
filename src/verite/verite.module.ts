import { Module } from '@nestjs/common';
import { VeriteService } from './verite.service';
import { VeriteController } from './verite.controller';
import { UsersService } from 'src/users/users.service';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CircleService } from 'src/circle/circle.service';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { Transaction, TransactionSchema } from 'src/transactions/schemas/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
  ],
  providers: [VeriteService, CircleService, BlockchainService, UsersService, TransactionsService],
  controllers: [VeriteController]
})
export class VeriteModule {}
