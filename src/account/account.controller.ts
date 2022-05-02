import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { AccountService } from './account.service';

@Controller('account')
@UseGuards(JwtAuthGuard)
export class AccountController {
    constructor(
        private readonly accountSerice: AccountService,
    ) {}
    
    @Get('get-balances')
    findOne(@Req() request) {
        const userId = request.user.userId;
        return this.accountSerice.getAllBalances(userId);
    }
}
