import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { CircleService } from 'src/circle/circle.service';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { ForexService } from './forex.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsService } from 'src/transactions/transactions.service';
import { Transaction, TransactionSchema } from 'src/transactions/schemas/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
  ],
  providers: [TransfersService, CircleService, BlockchainService, ForexService, UsersService, TransactionsService],
  controllers: [TransfersController]
})
export class TransfersModule {}
