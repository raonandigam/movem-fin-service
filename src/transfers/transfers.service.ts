import { Injectable } from '@nestjs/common';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { CircleService } from 'src/circle/circle.service';
import { UsersService } from 'src/users/users.service';
import { ForexService } from './forex.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransfersService {
    constructor(
        private readonly circleService: CircleService,
        private readonly blockchainService: BlockchainService,
        private readonly forexService: ForexService,
        private readonly userService: UsersService,
        private readonly transactionService: TransactionsService,
    ) {}
        
    async sendUserUSDTONewrl(userId: any, usdAmount: number) {
        const user = await this.userService.findById(userId);
        // TODO - Make this a transaction
        const circle_response = await this.circleService.transferUSDC(user.circle_wallet, this.circleService.MOVEM_WALLET_ID, usdAmount);
        const response = await this.blockchainService.issueNUSD(user.wallet_address, usdAmount)
        const transactionId = await this.transactionService.createTransaction({user: userId, transactionId: circle_response.id, type: 'Newrl', description: 'Send USDC to Chain', amount: usdAmount, currency: 'USD', status: 'Pending'})
        setTimeout(async () => {
            await this.transactionService.changeTransactionStatus(transactionId, 'Complete')
            await this.convertNUSDToNINR(userId, usdAmount);
        }, 65000)
        return {
            'circle_response': circle_response,
            'response': response
        };
    }
    
    async sendUSDToNewrl(newrlDestinationWallet: string, usdAmount: number) {
        const response = await this.blockchainService.issueNUSD(newrlDestinationWallet, usdAmount)
        return {'status': response}
    }
    
    async convertNUSDToNINR(userId: string, usdAmount: number) {
        const conversionRate = await this.forexService.getFxRate('USD', 'INR')
        const inrAmount = usdAmount * conversionRate;

        const user = await this.userService.findById(userId)
        const wallet = {
            "public": user.publicKey,
            "private": user.privateKey,
            "address": user.wallet_address
        }
        const convertId = await this.transactionService.createTransaction({
            user: userId, type: 'Convert', description: 'Convert USD to INR', amount: usdAmount, currency: 'USD', status: 'Pending',
            transactionId: ''
        })
        // Updating automatically after a block interval in Newrl. This need to change to polling/event driven.
        setTimeout(async () => {
            await this.transactionService.changeTransactionStatus(convertId, 'Complete')
        }, 60000)
        const response = await this.blockchainService.bilateralTransferWithCustodian(wallet, 'NUSD', 'NINRTest', usdAmount, inrAmount)
        return {'status': response}
    }
    
}
