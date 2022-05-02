import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('add-wallet')
  addWallet(@Req() request) {
    const userId = request.user.userId;
    return this.userService.addWallet(userId);
  }

  @Get('get-wallet-balance')
  getWalletBalance(@Req() request) {
    const userId = request.user.userId;
    return this.userService.getWalletBalance(userId);
  }

  @Get('get-user-details')
  getUser(@Req() request) {
    const userId = request.user.userId;
    return this.userService.getUserDetails(userId);
  }
}
