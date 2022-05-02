import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './schemas/transaction.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
      ) {}
      
    async getTransactionsForUser(userId: any) {
        return await this.transactionModel.find({ user: userId }).exec();
    }

    async createTransaction(dto: CreateTransactionDto) {
        const transactionId = uuidv4();
        dto.transactionId = transactionId;
        await this.transactionModel.create(dto);
        return transactionId;
    }
    
    async changeTransactionStatus(transactionId: string, status: string) {
        const transaction = await this.transactionModel.findOne({transactionId: transactionId});
        transaction.status = status;
        return await transaction.save()
    }
}
