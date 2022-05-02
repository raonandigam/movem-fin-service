import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { BlockchainService } from '../blockchain/blockchain.service';
import { CircleModule } from 'src/circle/circle.module';
import { CircleService } from 'src/circle/circle.service';
import { Transaction, TransactionSchema } from 'src/transactions/schemas/transaction.schema';
import { TransactionsService } from 'src/transactions/transactions.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    BlockchainModule,
    CircleModule,
  ],
  providers: [UsersService, BlockchainService, CircleService,TransactionsService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
