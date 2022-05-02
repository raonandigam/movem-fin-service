import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
    constructor (
        private readonly transactionService: TransactionsService,
    ) {}

    // @Post('create-newrl-transaction')
    // createNewrlTransaction(@Body() dto: CreateTransactionDto, @Req() request) {
    //     const userId = request.user.userId;
    //     await this.transactionService.createTransaction({user: userId, transactionId: payment.id, type: 'Circle', description: 'Buy USDC', amount: amount, currency: 'USD', status: 'Pending'})
    // }

    @Get('get-transactions-for-user')
    getWalletBalance(@Req() request) {
      const userId = request.user.userId;
      return this.transactionService.getTransactionsForUser(userId);
    }
}
