import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { CircleService } from './circle.service';

@Controller('circle')
@UseGuards(JwtAuthGuard)
export class CircleController {
  constructor(private readonly circleService: CircleService) {}

  @Post('add-wallet')
  addWallet() {
    return this.circleService.addWallet();
  }

  @Get('get-wallet-balance/:walletId')
  getWalletBalance(@Param('walletId') walletId: number) {
    return this.circleService.getWalletBalance(walletId);
  }

  @Post('buy-usdc')
  buyUSDC(
    @Body('amount') amount: number,
    @Body('dstWallet') dstWallet: number,
    @Req() request
  ) {
    const userId = request.user.userId;
    return this.circleService.buyUSDC(userId,amount, dstWallet);
  }

  @Get(':paymentId')
  getPaymetn(@Param('paymentId') paymentId: string) {
    return this.circleService.getPayment(paymentId);
  }

  @Post('transfer')
  transfer(
    @Query('srcWallet') srcWallet: number,
    @Query('dstWallet') dstWallet: number,
    @Query('amount') amount: number,
  ) {
    return this.circleService.transferUSDC(srcWallet, dstWallet, amount);
  }

  @Post('transfer-to-blockchain')
  transferToBlockchain(
    @Query('srcWallet') srcWallet: number,
    @Query('dstWallet') dstWallet: string,
    @Query('amount') amount: number,
  ) {
    return this.circleService.transferToBlockchain(
      srcWallet,
      dstWallet,
      amount,
    );
  }
}
