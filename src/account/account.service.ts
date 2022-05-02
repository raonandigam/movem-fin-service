import { Injectable } from '@nestjs/common';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { CircleService } from 'src/circle/circle.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AccountService {
    constructor (
        private readonly circleService: CircleService,
        private readonly blockchainService: BlockchainService,
        private readonly userService: UsersService,
    ) {}

    async getAllBalances(userId: any) {
        const balances = {
            'USDC': await this.getUserUSDWalletBalance(userId),
            'NUSD': await this.getUserNUSDWalletBalance(userId),
            'NINR': await this.getUserNINRWalletBalance(userId),
        }
    }
    
    async getUserUSDWalletBalance(userId: string) {
        const user = await this.userService.findById(userId);
        return this.circleService.getWalletBalance(user.circle_wallet);
    }
    
    async getUserNUSDWalletBalance(userId: string) {
        const user = await this.userService.findById(userId);
        return this.blockchainService.getWalletTokenBalance(user.wallet_address, 'NUSD');
    }
    
    async getUserNINRWalletBalance(userId: string) {
        const user = await this.userService.findById(userId);
        return this.blockchainService.getWalletTokenBalance(user.wallet_address, 'NINR');
    }
}
