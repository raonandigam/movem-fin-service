import { Controller, Post, Req, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { TransfersService } from './transfers.service';

@Controller('transfers')
@UseGuards(JwtAuthGuard)
export class TransfersController {
    constructor (
        private readonly transferService: TransfersService
    ) {}

    @Post('send-usd-to-newrl')
    sendUSDFromCircleToNewrl(
        @Body('usd_amount') usdAmount: number, 
        @Req() request
    ) {
        const userId = request.user.userId;
        return this.transferService.sendUserUSDTONewrl(userId, usdAmount)
    }
    
    @Post('convert-nusd-to-ninr')
    convertNUSDToNINR(
        @Body('usd_amount') usdAmount: number, 
        @Req() request
    ) {
        const userId = request.user.userId;
        return this.transferService.convertNUSDToNINR(userId, usdAmount)
    }
}
