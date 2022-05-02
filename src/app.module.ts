import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LoansModule } from './loans/loans.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { CollateralsModule } from './collaterals/collaterals.module';
import { CollateralsService } from './collaterals/collaterals.service';
import { BlockchainModule } from './blockchain/blockchain.module';
import { CircleModule } from './circle/circle.module';
import { TransfersModule } from './transfers/transfers.module';
import { ForexService } from './transfers/forex.service';
import { AccountModule } from './account/account.module';
import { VeriteModule } from './verite/verite.module';
import { TransactionsModule } from './transactions/transactions.module';
import 'dotenv/config';

const db_url = process.env.DB_URL;

@Module({
  imports: [
    MongooseModule.forRoot(db_url),
    LoansModule,
    UsersModule,
    AuthModule,
    CollateralsModule,
    HttpModule,
    BlockchainModule,
    CircleModule,
    TransfersModule,
    AccountModule,
    VeriteModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ForexService],
})
export class AppModule {}
